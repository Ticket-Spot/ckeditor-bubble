import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

export default class PaddingSelection extends Plugin {
  init() {
    const editor = this.editor;
    const t = editor.t;

    // Define the padding options to display in the dropdown
    const paddingOptions = [
      { model: '0px', view: '0px' },
      { model: '5px', view: '5px' },
      { model: '10px', view: '10px' },
      { model: '15px', view: '15px' },
      // Add more padding options as needed
    ];

    // Register the 'paddingSelection' command
    editor.ui.componentFactory.add('paddingSelection', locale => {
      const dropdownView = createDropdown(locale);

      // Populate the dropdown with padding options
      addListToDropdown(dropdownView, paddingOptions);

      // Execute the 'paddingSelection' command when an option is selected
      dropdownView.on('execute', event => {
        editor.execute('paddingSelection', { value: event.source.commandParam });
      });

      // Set the label for the dropdown button
      dropdownView.buttonView.set({
        label: t('Padding'),
        tooltip: true,
        withText: true,
      });

      // Enable the dropdown when the editor is ready
      editor.on('ready', () => {
        editor.ui.getEditableElement().parentElement.insertBefore(dropdownView.element, editor.ui.view.toolbar.element);
        dropdownView.render();
      });

      return dropdownView;
    });

    // Register the 'paddingSelection' command handler
    editor.commands.add('paddingSelection', {
      exec: (editor, options) => {
        editor.model.change(writer => {
          const selectedElement = editor.model.document.selection.getSelectedElement();

          if (selectedElement) {
            const { value } = options;
            const styleAttribute = `padding: ${value}`;
            writer.setAttribute('style', styleAttribute, selectedElement);
          }
        });
      },
    });
  }
}
