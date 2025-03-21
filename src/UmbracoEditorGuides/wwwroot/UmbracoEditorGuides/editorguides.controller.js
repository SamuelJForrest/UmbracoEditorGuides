angular.module("umbraco")
  .controller("Umbraco.EditorGuides", function ($scope, editorState, userService, contentResource) {
    var vm = this;

    vm.LISTING_STATE = "LISTING";
    vm.EDITING_STATE = "EDITING";
    vm.VIEW_STATE = "VIEWING";
    vm.DELETE_STATE = "DELETING";

    vm.viewState = vm.LISTING_STATE;
    vm.CurrentNodeId = editorState.current.id;
    vm.CurrentNodeModel = editorState.current;
    vm.CurrentNodeAlias = vm.CurrentNodeModel.contentTypeAlias;
    vm.CurrentNodeTypeId = vm.CurrentNodeModel.contentTypeId;
    vm.CurrentNodeIcon = vm.CurrentNodeModel.icon.split(' ')[0];
    vm.CurrentGuide = {};

    vm.$onInit = () => {
      vm.FriendlyDocTypeName = capitalizeCamelCaseString(vm.CurrentNodeAlias);
    }

    vm.setViewState = (state) => {
      vm.viewState = state;
      vm.loadGuides();
    }

    vm.viewGuide = (guideId) => {
      vm.setViewState(vm.VIEW_STATE);
      vm.setCurrentGuide(guideId);
    }

    vm.showDeleteWarning = (guideId) => {
      vm.setViewState(vm.DELETE_STATE);
      vm.setCurrentGuide(guideId);
    }

    vm.setCurrentGuide = (guideId) => {
      var allGuides = JSON.parse(localStorage.getItem('editorGuides'));
      var currentGuide = allGuides.filter(guide => guide.id === guideId);

      vm.CurrentGuide = currentGuide[0];
    }

    vm.deleteGuide = (guideId) => {
      var allGuides = JSON.parse(localStorage.getItem('editorGuides'));
      var updatedGuides = allGuides.filter(guide => guide.id !== guideId);
      localStorage.setItem('editorGuides', JSON.stringify(updatedGuides));
      vm.viewState = vm.LISTING_STATE;
      vm.loadGuides();
    }

    vm.loadGuides = () => {
      var allEditorGuides = JSON.parse(localStorage.getItem('editorGuides'));
      var currentGuides = [];

      if (!allEditorGuides) return;

      allEditorGuides.forEach(guide => {
        if (guide.contentTypeId != vm.CurrentNodeTypeId) return;

        currentGuides.push(guide);
      });

      vm.CurrentGuides = currentGuides;
    }
    vm.loadGuides();

    vm.saveGuide = () => {
      var editorGuidesTitle = document.querySelector('#editorguides-title');
      var editorInput = document.querySelector('#editorguides-input');
      var currentTitle = editorGuidesTitle.value;
      var currentEditorValue = editorInput.value;

      if (!currentEditorValue || !currentTitle) return;

      var editorGuideObj = {
        "id": self.crypto.randomUUID(),
        "contentTypeId": vm.CurrentNodeTypeId,
        "nodeAlias": vm.CurrentNodeAlias,
        "title": currentTitle,
        "content": currentEditorValue,
        "icon": vm.CurrentNodeIcon
      }

      var allEditorGuides = JSON.parse(localStorage.getItem('editorGuides'));

      if (allEditorGuides == null) {
        allEditorGuides = [];
      } else {
        console.log(allEditorGuides);
      }

      allEditorGuides.push(editorGuideObj);

      localStorage.setItem('editorGuides', JSON.stringify(allEditorGuides));

      vm.setViewState(vm.LISTING_STATE);
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
