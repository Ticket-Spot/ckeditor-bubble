import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { Collection } from '@ckeditor/ckeditor5-utils/src';
import { Model, createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src';

import marginIcon from './marginSelection.svg';

export default class MarginSelection extends Plugin {
  static get pluginName() {
    return 'marginSelection';
  }

  init() {
    const editor = this.editor;
    const t = editor.t;

    const command = editor.commands.get('marginSelection');

    // Define the margin options to display in the dropdown
    const marginOptions = [
      { value: '0px', label: '0px', icon: marginIcon },
      { value: '5px', label: '5px', icon: marginIcon },
      { value: '10px', label: '10px', icon: marginIcon },
      { value: '15px', label: '15px', icon: marginIcon },
      // Add more margin options as needed
    ];

    // Register the 'marginSelection' command
    editor.ui.componentFactory.add('marginSelection', locale => {
      const dropdownView = createDropdown(locale);

      addListToDropdown(dropdownView, () => prepareListOptions(marginOptions, command), {
        role: 'menu',
        ariaLabel: 'Margin'
      });

      this.listenTo(dropdownView, 'execute', evt => {
        editor.execute(evt.source.commandName, { value: evt.source.commandParam });
        editor.editing.view.focus();
      });

      // Set the label for the dropdown button
      dropdownView.buttonView.set({
        label: t('Margin'),
        tooltip: true,
        withText: false,
        isToggleable: true,
        icon: marginIcon, // Set the icon for the dropdown button
      });

      return dropdownView;
    });

    // Register the 'marginSelection' command handler
    editor.commands.add('marginSelection', {
      value: null, // Add an observable 'value' property to the command
      exec: (editor, options) => {
        // Update the 'value' property of the command
        this.value = options.value;

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

function prepareListOptions(options, command) {
  const itemDefinitions = new Collection();

  console.log('options', options)
  for (const option of options) {
    const def = {
      type: 'button',
      model: new Model({
        commandName: 'marginSelection',
        commandParam: option.value,
        label: option.label,
        role: 'menuitemradio',
        withText: true
      })
    };

    def.model.bind('isOn').to(command, 'value', value => {
      return value === option.value;
    });

    itemDefinitions.add(def);
  }

  return itemDefinitions;
}
