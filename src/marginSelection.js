import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

export default class MarginSelection extends Plugin {
  static get pluginName() {
		return 'MarginSelection';
	}
  init() {
    const editor = this.editor;
    const t = editor.t;

    // Define the margin options to display in the dropdown
    const marginOptions = [
      { model: '0px', view: '0px' },
      { model: '5px', view: '5px' },
      { model: '10px', view: '10px' },
      { model: '15px', view: '15px' },
      // Add more margin options as needed
    ];

    // Register the 'marginSelection' command
    editor.ui.componentFactory.add('marginSelection', locale => {
      const dropdownView = createDropdown(locale);

      // Populate the dropdown with margin options
      addListToDropdown(dropdownView, marginOptions);

      // Execute the 'marginSelection' command when an option is selected
      dropdownView.on('execute', event => {
        editor.execute('marginSelection', { value: event.source.commandParam });
      });

      // Set the label for the dropdown button
      dropdownView.buttonView.set({
        label: t('Margin'),
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

    // Register the 'marginSelection' command handler
    editor.commands.add('marginSelection', {
      exec: (editor, options) => {
        editor.model.change(writer => {
          const selectedElement = editor.model.document.selection.getSelectedElement();

          if (selectedElement) {
            const { value } = options;
            const styleAttribute = `margin: ${value}`;
            writer.setAttribute('style', styleAttribute, selectedElement);
          }
        });
      },
    });
  }
}
