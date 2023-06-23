import { ButtonView, FocusCycler, LabeledFieldView, View, ViewCollection, createLabeledInputText, submitHandler } from 'ckeditor5/src/ui';
import { FocusTracker, KeystrokeHandler } from 'ckeditor5/src/utils';
import { icons } from 'ckeditor5/src/core';

import '@ckeditor/ckeditor5-ui/theme/components/responsive-form/responsiveform.css';

export default class PaddingFormView extends View {
  constructor(locale, linkCommand) {
    super(locale);

    this.focusTracker = new FocusTracker();
    this.keystrokes = new KeystrokeHandler();
    this._focusables = new ViewCollection();

    const t = locale.t;
    this.topInputView = this._createNumberInput(t('Top'));
    this.rightInputView = this._createNumberInput(t('Right'));
    this.bottomInputView = this._createNumberInput(t('Bottom'));
    this.leftInputView = this._createNumberInput(t('Left'));

    this.saveButtonView = this._createButton(t('Save'), icons.check, 'ck-button-save');
    this.saveButtonView.type = 'submit';

    this.cancelButtonView = this._createButton(t('Cancel'), icons.cancel, 'ck-button-cancel', 'cancel');

    this._focusCycler = new FocusCycler({
      focusables: this._focusables,
      focusTracker: this.focusTracker,
      keystrokeHandler: this.keystrokes,
      actions: {
        focusPrevious: 'shift + tab',
        focusNext: 'tab',
      },
    });

    this.setTemplate({
      tag: 'form',
      attributes: {
        class: ['ck', 'ck-padding-form', 'ck-responsive-form'],
        tabindex: '-1',
      },
      children: [
        this.topInputView,
        this.rightInputView,
        this.bottomInputView,
        this.leftInputView,
        this.saveButtonView,
        this.cancelButtonView,
      ],
    });
  }

  render() {
    super.render();
    submitHandler({
      view: this,
    });

    const childViews = [
      this.topInputView,
      this.rightInputView,
      this.bottomInputView,
      this.leftInputView,
      this.saveButtonView,
      this.cancelButtonView,
    ];

    childViews.forEach((v) => {
      this._focusables.add(v);
      this.focusTracker.add(v.element);
    });

    this.keystrokes.listenTo(this.element);
  }

  destroy() {
    super.destroy();
    this.focusTracker.destroy();
    this.keystrokes.destroy();
  }

  focus() {
    this._focusCycler.focusFirst();
  }

  _createNumberInput(label) {
    const t = this.locale.t;
    const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);
    labeledInput.label = label;
    labeledInput.fieldView.type = 'number';
    return labeledInput;
  }

  _createButton(label, icon, className, eventName) {
    const button = new ButtonView(this.locale);
    button.set({
      label,
      icon,
      tooltip: true,
    });
    button.extendTemplate({
      attributes: {
        class: className,
      },
    });
    if (eventName) {
      button.delegate('execute').to(this, eventName);
    }
    return button;
  }
}
