import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import { ALLOWED_FORMATS } from "../../config/define";
import { ConfigBlock } from "../../components/config-block";
import { ImageUploadSingle } from "../../components/image-upload";

const Control = function ({ props }) {
  const { attributes, setAttributes } = props;
  return (
    <InspectorControls key="settting">
      <PanelBody title="Cấu hình block" initialOpen={true}>
        <ConfigBlock data={attributes} setData={setAttributes} />
      </PanelBody>
    </InspectorControls>
  );
};

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;

  return (
    <Fragment>
      <div class="block common-block-banner">
        <div class="banner-bg">
          <ImageUploadSingle
            value={attributes.img}
            onChange={(value) => {
              if (!value) return false;
              setAttributes({
                img: value,
              });
            }}
          />
        </div>
        <div class="banner-inner">
          <RichText
            tagName="h2"
            className="ttl"
            value={attributes.title}
            allowedFormats={ALLOWED_FORMATS}
            placeholder="Case Study"
            keepPlaceholderOnFocus={true}
            onChange={(value) => setAttributes({ title: value })}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default function Edit(props) {
  return (
    <div {...useBlockProps()}>
      <Control props={props}></Control>
      <FragmentBlock props={props}></FragmentBlock>
    </div>
  );
}
