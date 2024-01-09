// my-custom-block.js

(function() {
  var el = wp.element.createElement;
  var registerBlockType = wp.blocks.registerBlockType;
  var TextControl = wp.components.TextControl;

  registerBlockType('my-plugin/my-custom-block', {
      title: 'My Custom Block',
      icon: 'smiley',
      category: 'common',
      attributes: {
          content: {
              type: 'string',
              default: 'Hello, World!'
          }
      },
      edit: function(props) {
          function updateContent(newContent) {
              props.setAttributes({ content: newContent });
          }

          return el(
              TextControl,
              {
                  label: 'Content',
                  value: props.attributes.content,
                  onChange: updateContent
              }
          );
      },
      save: function(props) {
          return el('p', null, props.attributes.content);
      }
  });
})();
