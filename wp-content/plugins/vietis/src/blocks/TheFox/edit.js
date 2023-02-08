import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from "@wordpress/block-editor";
import {
  PanelBody,
  __experimentalInputControl as InputControl,
} from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import { ALLOWED_FORMATS } from "../../config/define";
import { ImageUploadSingle } from "../../components/image-upload";
import { ConfigBlock,processConfig } from "../../components/config-block";

const Control = function ({ props }) {
  const { attributes, setAttributes } = props;

  return (
    <>
      <InspectorControls key="settting">
        <PanelBody title="Cấu hình chung" initialOpen={true}>
        </PanelBody>
        <PanelBody title="Cấu hình block" initialOpen={true}>
          <ConfigBlock data={attributes} setData={setAttributes} />
        </PanelBody>
      </InspectorControls>
    </>
  );
};

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;

  let data = processConfig(attributes.config);
  return (
    <Fragment>
      <div class="block block-thefox">
        <div class="holder">
          <div class="wrapper">
            <div class="content">
              <RichText
                tagName="h4"
                className="title"
                value={attributes?.title}
                onChange={(value) => {
                  setAttributes({title: value})
                }}
              />
              <RichText
                tagName="p"
                className="desc"
                value={attributes?.desc}
                allowedFormats={ALLOWED_FORMATS}
                onChange={(value) => {
                  setAttributes({desc: value})
                }}
              />
            </div>
            <div class="image">
              <ImageUploadSingle
                className="img"
                value={attributes?.image}
                onChange={(value) => {
                  setAttributes({image: value})
                }}
              />
            </div>
          </div>
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
