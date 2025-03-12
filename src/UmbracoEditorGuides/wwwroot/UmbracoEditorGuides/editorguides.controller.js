angular.module("umbraco")
  .controller("Umbraco.EditorGuides", function ($scope, editorState, userService, contentResource) {
    var vm = this;
    vm.editingModeEnabled = false;
    vm.viewModeEnabled = false;
    vm.CurrentNodeId = editorState.current.id;
    vm.CurrentNodeModel = editorState.current;
    vm.CurrentNodeAlias = vm.CurrentNodeModel.contentTypeAlias;
    vm.CurrentNodeTypeId = vm.CurrentNodeModel.contentTypeId;
    vm.CurrentNodeIcon = vm.CurrentNodeModel.icon.split(' ')[0];
    vm.CurrentGuide = {};

    vm.$onInit = () => {
      vm.FriendlyDocTypeName = capitalizeCamelCaseString(vm.CurrentNodeAlias);
    }

    vm.returnToListingMode = () => {
      vm.editingModeEnabled = false;
      vm.viewModeEnabled = false;
    }

    vm.toggleEditingMode = () => {
      vm.editingModeEnabled = vm.editingModeEnabled ? false : true;
      vm.loadGuides();
    }

    vm.setViewMode = (guideId) => {
      vm.editingModeEnabled = false;
      vm.viewModeEnabled = true;

      var allGuides = JSON.parse(localStorage.getItem('editorGuides'));
      var currentGuide = allGuides.filter(guide => guide.id === guideId);

      vm.CurrentGuide = currentGuide[0];

      console.log(currentGuide);
    }

    //vm.retrieveGuide = (guideId) => {

    //}

    vm.deleteGuide = (guideId) => {
      var allGuides = JSON.parse(localStorage.getItem('editorGuides'));
      var updatedGuides = allGuides.filter(guide => guide.id !== guideId);
      console.log(updatedGuides);
      localStorage.setItem('editorGuides', JSON.stringify(updatedGuides));
      vm.loadGuides();
    }

    vm.loadGuides = () => {
      var allEditorGuides = JSON.parse(localStorage.getItem('editorGuides'));
      var currentGuides = [];

      if (!allEditorGuides) return;

      allEditorGuides.forEach(guide => {
        console.log(guide.contentTypeId);

        if (guide.contentTypeId != vm.CurrentNodeTypeId) return;

        currentGuides.push(guide);
      });

      console.log(currentGuides);
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
        console.log('editor guides are null');
        allEditorGuides = [];
      } else {
        console.log(allEditorGuides);
      }

      allEditorGuides.push(editorGuideObj);

      var retrievedEditorGuides = localStorage.setItem('editorGuides', JSON.stringify(allEditorGuides));
      console.log(retrievedEditorGuides);

      console.log(editorGuideObj);
      console.log(allEditorGuides);

      vm.toggleEditingMode();
    }

    function capitalizeCamelCaseString(camelCaseString) {
      return camelCaseString
        .replace(/([A-Z])/g, ' $1') // Add space before each uppercase letter
        .replace(/^./, function (str) { return str.toUpperCase(); }) // Capitalize the first letter
        .split(' ') // Split the string into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' '); // Join the words back into a single string
    }
  });
