import { Plugin } from 'ckeditor5/src/core';
import { ClickObserver } from 'ckeditor5/src/engine';
import { ButtonView, ContextualBalloon, clickOutsideHandler } from 'ckeditor5/src/ui';
import { isWidget } from 'ckeditor5/src/widget';
import PaddingFormView from './ui/spacing-form-view';
import { isSpacingElement } from './utils';
import Icon from './paddingSelection.svg';
const VISUAL_SELECTION_MARKER_PADDING_NAME = 'padding-selection-ui';

const COMMAND_NAME = 'paddingSelection';
export default class PaddingSelectionUI extends Plugin {
    constructor() {
        super(...arguments);

        this.formView = null;
    }

    static get requires() {
        return [ContextualBalloon];
    }

    static get pluginName() {
        return 'PaddingSelection';
    }

    init() {
        const editor = this.editor;
        editor.editing.view.addObserver(ClickObserver);
        this._balloon = editor.plugins.get(ContextualBalloon);

    editor.commands.add(COMMAND_NAME, {
      value: null,
        isEnabled: false, 

      execute: (options) => {
  const { top = 0, right = 0, bottom = 0, left = 0 } = options;
  const view = this.editor.editing.view;

  editor.model.change(writer => {
        const selection = view.document.selection;
        const selectedElement = selection.getSelectedElement();


    if (selectedElement) {
      const styleAttribute = `padding: ${top} ${right} ${bottom} ${left}`;
      writer.setAttribute('style', styleAttribute, selectedElement);
    }
  });
          this.isEnabled = true;
      },
    });
        this._createToolbarSpacingButton();
        this._enableBalloonActivators();

    }

    destroy() {
        super.destroy();

        if (this.formView) {
            this.formView.destroy();
        }
    }

    _createViews() {
        this.formView = this._createFormView();

        this._enableUserBalloonInteractions();
    }

_createFormView() {
  const editor = this.editor;
  const paddingCommand = editor.commands.get(COMMAND_NAME);
  const formView = new PaddingFormView(editor.locale, paddingCommand);
  debugger;
  formView.topInputView.fieldView.bind('value').to(paddingCommand, 'top');
  formView.rightInputView.fieldView.bind('value').to(paddingCommand, 'right');
  formView.bottomInputView.fieldView.bind('value').to(paddingCommand, 'bottom');
  formView.leftInputView.fieldView.bind('value').to(paddingCommand, 'left');

  formView.saveButtonView.bind('isEnabled').to(paddingCommand);

  this.listenTo(formView, 'submit', () => {
    debugger;
    editor.execute(COMMAND_NAME, {
      top: formView.topInputView.fieldView.element.value,
      right: formView.rightInputView.fieldView.element.value,
      bottom: formView.bottomInputView.fieldView.element.value,
      left: formView.leftInputView.fieldView.element.value,
    });
    // this._closeFormView();
  });

  this.listenTo(formView, 'cancel', () => {
    this._closeFormView();
  });

  formView.keystrokes.set('Esc', (data, cancel) => {
    this._closeFormView();
    cancel();
  });

  return formView;
}

_createToolbarSpacingButton() {
  const editor = this.editor;
  const paddingSelectionCommand = editor.commands.get(COMMAND_NAME);
  const t = editor.t;

  editor.ui.componentFactory.add(COMMAND_NAME, locale => {
    const button = new ButtonView(locale);
    button.set({
      label: t('Padding'),
      icon: Icon,
      tooltip: true,
      isToggleable: true
    });


    const updateButtonEnabledState = () => {
      button.isEnabled = paddingSelectionCommand.isEnabled
    };

    this.listenTo(paddingSelectionCommand, 'change:isEnabled', updateButtonEnabledState);

    button.bind('isOn').to(paddingSelectionCommand, 'value', value => !!value);

    this.listenTo(button, 'execute', () => this._showUI(true));
    return button;
  });
}


    _enableBalloonActivators() {
        const editor = this.editor;
        const viewDocument = editor.editing.view.document;

        this.listenTo(viewDocument, 'click', () => {
            const parentSpacing = this._getSelectedSpacingElement();
            if (parentSpacing) {

                this._showUI();
            }
        });

    }

    _enableUserBalloonInteractions() {

        this.editor.keystrokes.set('Esc', (data, cancel) => {
            if (this._isUIVisible) {
                this._hideUI();
                cancel();
            }
        });

        clickOutsideHandler({
            emitter: this.formView,
            activator: () => this._isUIInPanel,
            contextElements: () => [this._balloon.view.element],
            callback: () => this._hideUI()
        });
    }

    _addFormView() {
      debugger;
        if (!this.formView) {
            this._createViews();
        }
        if (this._isFormInPanel) {
            return;
        }
        
        this._balloon.add({
            view: this.formView,
             position: this._getBalloonPositionData()
        });
    }

    _closeFormView() {
        const paddingSelectionCommand = this.editor.commands.get(COMMAND_NAME);

        // paddingSelectionCommand.restoreManualDecoratorStates();
        if (paddingSelectionCommand.value !== undefined) {
          
            this._removeFormView();
        }
        else {
            this._hideUI();
        }
    }

    _removeFormView() {
        if (this._isFormInPanel) {

            this.formView.saveButtonView.focus();
            this._balloon.remove(this.formView);

            this.editor.editing.view.focus();
            this._hideFakeVisualSelection();
        }
    }

    _showUI(forceVisible = false) {
        if (!this.formView) {
            this._createViews();
        }

        if (!this._getSelectedSpacingElement()) {

            this._showFakeVisualSelection();

            if (forceVisible) {
                this._balloon.showStack('main');
            }
            this._addFormView();
        }

        else {

            if (forceVisible) {
                this._balloon.showStack('main');
            }
        }

        this._startUpdatingUI();
    }

    _hideUI() {
        if (!this._isUIInPanel) {
            return;
        }
        const editor = this.editor;
        this.stopListening(editor.ui, 'update');
        this.stopListening(this._balloon, 'change:visibleView');

        editor.editing.view.focus();

        this._removeFormView();

        this._hideFakeVisualSelection();
    }

    _startUpdatingUI() {
        const editor = this.editor;
        const viewDocument = editor.editing.view.document;
        let prevSelectedSpacing = this._getSelectedSpacingElement();
        let prevSelectionParent = getSelectionParent();
        const update = () => {
            const selectedSpacing = this._getSelectedSpacingElement();
            const selectionParent = getSelectionParent();

            if ((prevSelectedSpacing && !selectedSpacing) ||
                (!prevSelectedSpacing && selectionParent !== prevSelectionParent)) {
                this._hideUI();
            }

            else if (this._isUIVisible) {

                this._balloon.updatePosition(this._getBalloonPositionData());
            }
            prevSelectedSpacing = selectedSpacing;
            prevSelectionParent = selectionParent;
        };
        function getSelectionParent() {
            return viewDocument.selection.focus.getAncestors()
                .reverse()
                .find((node) => node.is('element'));
        }
        this.listenTo(editor.ui, 'update', update);
        this.listenTo(this._balloon, 'change:visibleView', update);
    }

    get _isFormInPanel() {
        return !!this.formView && this._balloon.hasView(this.formView);
    }

    get _isUIInPanel() {
        return this._isFormInPanel;
    }

    get _isUIVisible() {
        const visibleView = this._balloon.visibleView;
        return !!this.formView && visibleView == this.formView;
    }

    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const model = this.editor.model;
        const viewDocument = view.document;
        const target  = () => {
                const targetSpacing = this._getSelectedSpacingElement();
                return targetSpacing ?

                    view.domConverter.mapViewToDom(targetSpacing) :

                    view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());
            };
       
        return { target };
    }

    _getSelectedSpacingElement() {
        const view = this.editor.editing.view;
        const selection = view.document.selection;
        const selectedElement = selection.getSelectedElement();

        if (selection.isCollapsed || selectedElement && isWidget(selectedElement)) {
            return findSpacingElementAncestor(selection.getFirstPosition());
        }
        else {

            const range = selection.getFirstRange().getTrimmed();
            const startSpacing = findSpacingElementAncestor(range.start);
            const endSpacing = findSpacingElementAncestor(range.end);
            if (!startSpacing || startSpacing != endSpacing) {
                return null;
            }

            if (view.createRangeIn(startSpacing).getTrimmed().isEqual(range)) {
                return startSpacing;
            }
            else {
                return null;
            }
        }
    }

_showFakeVisualSelection() {
  const model = this.editor.model;
  model.change(writer => {
    const range = model.document.selection.getFirstRange();
    if (model.markers.has(VISUAL_SELECTION_MARKER_PADDING_NAME)) {
      writer.updateMarker(VISUAL_SELECTION_MARKER_PADDING_NAME, { range });
    } else {
      if (range.start.isAtEnd) {
        const startPosition = range.start.getLastMatchingPosition(
          ({ item }) => !model.schema.isContent(item),
          { boundaries: range }
        );
        writer.addMarker(VISUAL_SELECTION_MARKER_PADDING_NAME, {
          usingOperation: false,
          affectsData: false,
          range: writer.createRange(startPosition, range.end),
        });
      } else {
        writer.addMarker(VISUAL_SELECTION_MARKER_PADDING_NAME, {
          usingOperation: false,
          affectsData: false,
          range,
        });
      }
    }
  });
}

_hideFakeVisualSelection() {
  const model = this.editor.model;
  if (model.markers.has(VISUAL_SELECTION_MARKER_PADDING_NAME)) {
    model.change(writer => {
      writer.removeMarker(VISUAL_SELECTION_MARKER_PADDING_NAME);
    });
  }
}
}

function findSpacingElementAncestor(position) {
    return position.getAncestors().find((ancestor) => isSpacingElement(ancestor)) || null;
}