angular.module("umbraco")
  .controller("Umbraco.EditorGuides", function ($scope, editorState, $http, $timeout, notificationsService, tinyMceAssets, tinyMceService) {
    var vm = this;

    vm.ViewStates = Object.freeze({
      LIST: "LIST",
      CREATE: "CREATE",
      EDIT: "EDIT",
      VIEW: "VIEW",
      DELETE: "DELETE"
    });

    vm.viewState = vm.ViewStates.LIST;
    vm.CurrentNodeId = editorState.current.id;
    vm.CurrentNodeModel = editorState.current;
    vm.CurrentNodeAlias = vm.CurrentNodeModel.contentTypeAlias;
    vm.CurrentNodeTypeId = vm.CurrentNodeModel.contentTypeId;
    vm.CurrentGuide = {};

    $scope.rteEditorGuides = {
      view: Umbraco.Sys.ServerVariables.umbracoSettings.umbracoPath + '/views/propertyeditors/rte/rte.html',
      value: "",
      config: {
        editor: {
          toolbar: ["ace", "undo", "redo", "bold", "italic", "bullist", "numlist", "link", "fullscreen", "umbmediapicker"],
          style_formats: [{ title: "Heading 1", inline: "h1" }],
          plugins: ["fullscreen", "umbmedia"],
          stylesheets: [],
          dimensions: { height: 300 }
        }
      },
      validation: {
        mandatory: false,
      }
    };

    vm.$onInit = () => {
      vm.FriendlyDocTypeName = capitalizeCamelCaseString(vm.CurrentNodeAlias);
    }

    vm.setViewState = (state) => {
      vm.viewState = state;
      vm.loadGuides();
    }

    vm.viewGuide = (guideId) => {
      vm.setViewState(vm.ViewStates.VIEW);
      vm.setCurrentGuide(guideId);
    }

    vm.showDeleteWarning = (guideId) => {
      vm.setViewState(vm.ViewStates.DELETE);
      vm.setCurrentGuide(guideId);
    }

    vm.setCurrentGuide = (guideId) => {
      $http.get(`/umbraco/backoffice/api/EditorGuidesApi/GetGuideByGuid?guid=${guideId}`)
        .then((response) => {
          vm.CurrentGuide = response.data.guide;
        });
    }

    vm.editGuide = (guideId) => {
      $http.get(`/umbraco/backoffice/api/EditorGuidesApi/GetGuideByGuid?guid=${guideId}`)
        .then((response) => {
          vm.setViewState(vm.ViewStates.EDIT);

          vm.setCurrentGuide(guideId);

          $timeout(() => {
            var editorGuidesTitle = document.querySelector('#editorguides-title');
            editorGuidesTitle.value = response.data.guide.Title;

            var editorGuidesDescription = document.querySelector('#editorguides-description');
            editorGuidesDescription.value = response.data.guide.Description;

            vm.setViewState(vm.ViewStates.EDIT);
          }, 0);

          $scope.rteEditorGuides.value = response.data.guide.Content;
        });
    }

    vm.deleteGuide = (guideId) => {
      $http.delete(`/umbraco/backoffice/api/EditorGuidesApi/DeleteGuide?guid=${guideId}`)
        .then((response) => {
          vm.viewState = vm.ViewStates.LIST;
          vm.loadGuides();
          notificationsService.success("Guide deleted");
        });
    }

    vm.loadGuides = () => {
      $http.get(`/umbraco/backoffice/api/EditorGuidesApi/GetGuidesByType?contentTypeId=${vm.CurrentNodeTypeId}`)
        .then((response) => {
          let allEditorGuides = response.data.guides;

          if (!allEditorGuides) return;

          const currentGuides = [];
          allEditorGuides.forEach(guide => {
            if (guide.ContentTypeId != vm.CurrentNodeTypeId) return;

            currentGuides.push(guide);
          });

          vm.CurrentGuides = currentGuides;
        });
    }
    vm.loadGuides();

    vm.saveGuide = async (guide) => {
      var editorGuidesTitle = document.querySelector('#editorguides-title');
      var editorGuidesDescription = document.querySelector('#editorguides-description');
      var currentTitle = editorGuidesTitle.value;
      var currentDescription = editorGuidesDescription.value;
      var currentEditorValue = $scope.rteEditorGuides.value.markup;

      if (!currentEditorValue || !currentTitle){
        notificationsService.error("Please ensure the current guide has a title and content.");
        return;
      }

      var editorGuideObj = {
        "contentTypeId": vm.CurrentNodeTypeId,
        "nodeAlias": vm.CurrentNodeAlias,
        "title": currentTitle,
        "description": currentDescription,
        "content": currentEditorValue,
      };

      console.log(vm.viewState);

      if (vm.viewState === vm.ViewStates.EDIT) {
        console.log(vm.CurrentGuide.Guid);
        await $http.get(`/umbraco/backoffice/api/EditorGuidesApi/GetGuideByGuid?guid=${vm.CurrentGuide.Guid}`)
          .then((response) => {
            console.log(response.data);
            editorGuideObj = {
              ...editorGuideObj,
              guid: response.data.guide.Guid,
            }
          })
        console.log(editorGuideObj);
        await $http.post('/umbraco/backoffice/api/EditorGuidesApi/EditGuide', editorGuideObj)
          .then(async () => {
            await vm.clearGuide();
            notificationsService.success("Guide updated successfully");
          });
      } else {
        editorGuideObj = {
          ...editorGuideObj,
          "guid": self.crypto.randomUUID(),
        };

        $http.post('/umbraco/backoffice/api/EditorGuidesApi/CreateGuide', editorGuideObj)
          .then(async () => {
            await vm.clearGuide();
            notificationsService.success("Guide saved successfully");
          });
      }
    }

    vm.clearGuide = () => {
      vm.setViewState(vm.ViewStates.LIST);
      vm.CurrentGuide = {};
      $scope.rteEditorGuides.value = "";
    }

    // TODO: move this into a service
    function capitalizeCamelCaseString(camelCaseString) {
      return camelCaseString
        .replace(/([A-Z])/g, ' $1') // Add space before each uppercase letter
        .replace(/^./, function (str) { return str.toUpperCase(); }) // Capitalize the first letter
        .split(' ') // Split the string into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' '); // Join the words back into a single string
    }
  });
