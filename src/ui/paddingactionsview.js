/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module link/ui/Paddingactionsview
 */
import { ButtonView, View, ViewCollection, FocusCycler } from 'ckeditor5/src/ui';
import { FocusTracker, KeystrokeHandler } from 'ckeditor5/src/utils';
import { icons } from 'ckeditor5/src/core';
import { ensureSafeUrl } from '../utils';
// See: #8833.
// eslint-disable-next-line ckeditor5-rules/ckeditor-imports
import '@ckeditor/ckeditor5-ui/theme/components/responsive-form/responsiveform.css';
/**
 * The link actions view class. This view displays the link preview, allows
 * unlinking or editing the link.
 */
export default class PaddingActionsView extends View {
    /**
     * @inheritDoc
     */
    constructor(locale) {
        super(locale);
        /**
         * Tracks information about DOM focus in the actions.
         */
        this.focusTracker = new FocusTracker();
        /**
         * An instance of the {@link module:utils/keystrokehandler~KeystrokeHandler}.
         */
        this.keystrokes = new KeystrokeHandler();
        /**
         * A collection of views that can be focused in the view.
         */
        this._focusables = new ViewCollection();
        const t = locale.t;
        this.previewButtonView = this._createPreviewButton();
        this.set('href', undefined);
        this._focusCycler = new FocusCycler({
            focusables: this._focusables,
            focusTracker: this.focusTracker,
            keystrokeHandler: this.keystrokes,
            actions: {
                // Navigate fields backwards using the Shift + Tab keystroke.
                focusPrevious: 'shift + tab',
                // Navigate fields forwards using the Tab key.
                focusNext: 'tab'
            }
        });
        this.setTemplate({
            tag: 'div',
            attributes: {
                class: [
                    'ck',
                    'ck-link-actions',
                    'ck-responsive-form'
                ],
                // https://github.com/ckeditor/ckeditor5-link/issues/90
                tabindex: '-1'
            },
            children: [
                this.previewButtonView,
            ]
        });
    }
    /**
     * @inheritDoc
     */
    render() {
        super.render();
        // Start listening for the keystrokes coming from #element.
        this.keystrokes.listenTo(this.element);
    }
     
    /**
     * @inheritDoc
     */
    destroy() {
        super.destroy();
        this.focusTracker.destroy();
        this.keystrokes.destroy();
    }
    /**
     * Focuses the fist {@link #_focusables} in the actions.
     */
    focus() {
        this._focusCycler.focusFirst();
    }
    /**
     * Creates a button view.
     *
     * @param label The button label.
     * @param icon The button icon.
     * @param eventName An event name that the `ButtonView#execute` event will be delegated to.
     * @returns The button view instance.
     */
    _createButton(label, icon, eventName) {
        const button = new ButtonView(this.locale);
        button.set({
            label,
            icon,
            tooltip: true
        });
        button.delegate('execute').to(this, eventName);
        return button;
    }
    /**
     * Creates a link href preview button.
     *
     * @returns The button view instance.
     */
    _createPreviewButton() {
        const button = new ButtonView(this.locale);
        const bind = this.bindTemplate;
        const t = this.t;
        button.set({
            withText: true,
            tooltip: t('Open link in new tab')
        });
        button.extendTemplate({
            attributes: {
                class: [
                    'ck',
                    'ck-link-actions__preview'
                ],
                href: bind.to('href', href => href && ensureSafeUrl(href)),
                target: '_blank',
                rel: 'noopener noreferrer'
            }
        });
        button.bind('label').to(this, 'href', href => {
            return href || t('This link has no URL');
        });
        button.bind('isEnabled').to(this, 'href', href => !!href);
        button.template.tag = 'a';
        button.template.eventListeners = {};
        return button;
    }
}
