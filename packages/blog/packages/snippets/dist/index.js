var React = require('react');

var ExampleComponent = function ExampleComponent(_ref) {
  var text = _ref.text;
  return React.createElement("div", {
    className: 'py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6'
  }, "Example Component: ", text);
};

exports.ExampleComponent = ExampleComponent;
//# sourceMappingURL=index.js.map
