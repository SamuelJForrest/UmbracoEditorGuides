angular.module("umbraco")
  .controller("Umbraco.EditorGuides", function ($scope, editorState, userService, contentResource) {
    var vm = this;
    vm.CurrentNodeId = editorState.current.id;
    console.log(vm);
  });
