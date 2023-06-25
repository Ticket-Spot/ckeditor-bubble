import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor.js';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily.js';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js';
import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import Style from '@ckeditor/ckeditor5-style/src/style.js';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js';
import Image from '@ckeditor/ckeditor5-image/src/image.js';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize.js';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar.js';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage.js';
import marginSelection from './marginSelection';
import paddingSelection from './paddingSelection';

class Editor extends BalloonEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
  Alignment,
  Bold,
  Essentials,
	Image,
	ImageCaption,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Link,
	LinkImage,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Indent,
  Italic,
  Link,
  List,
  Paragraph,
  Style,
  Underline,
//   marginSelection,
//   paddingSelection
];

// Editor configuration.
Editor.defaultConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'undo',
      'redo',
      '|',
      'marginSelection',
      'paddingSelection',
    ]
  },
  language: 'en',
  	image: {
		toolbar: [
			'imageTextAlternative',
			'toggleImageCaption',
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:side',
			'linkImage'
		]
	}
};

export default Editor;
