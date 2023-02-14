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
import { ALLOWED_FORMATS } from "../../../../config/define";
import { ImageUploadSingle } from "../../../../components/image-upload";
import {
  ConfigBlock,
} from "../../../../components/config-block";

const Control = function ({ props }) {
  const { attributes, setAttributes } = props;

  return (
    <>
      <InspectorControls key="settting">
        <PanelBody title="Cấu hình chung" initialOpen={true}>
          <div className="mb-3">
            <InputControl
              value={attributes?.title}
              onChange={(value) => setAttributes({ title: value })}
              placeholder="Nhập tiêu đề"
              label="Tiêu đề"
            />
          </div>
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

  return (
    <Fragment>
      <div className="block block-veramine-banner">
        <div class="holder">
          <div class="header">
            <div class="logo">
              <ImageUploadSingle
                value={attributes?.logo}
                onChange={(value) => {
                  setAttributes({ logo: value });
                }}
              />
            </div>
            <RichText
              tagName="p"
              className="header-txt"
              value={attributes?.header_txt}
              placeholder="Title"
              onChange={(value) => {
                setAttributes({ header_txt: value });
              }}
            />
          </div>

          <div class="content">
            <div class="desc">
              <RichText
                tagName="h2"
                className="ttl"
                placeholder="Title"
                allowedFormats={ALLOWED_FORMATS}
                value={attributes?.title}
                onChange={(value) => {
                  setAttributes({ title: value });
                }}
              />
              <RichText
                tagName="div"
                className="txt"
                placeholder="Description"
                allowedFormats={ALLOWED_FORMATS}
                value={attributes?.description}
                onChange={(value) => {
                  setAttributes({ description: value });
                }}
              />
            </div>
            <div class="img">
              <ImageUploadSingle
                value={attributes?.image}
                onChange={(value) => {
                  setAttributes({ image: value });
                }}
              />
            </div>
          </div>

          <ul class="list">
            {attributes?.steps &&
              attributes?.steps.map((item, index) => {
                return (
                  <li className="item">
                    <RichText
                      tagName="span"
                      value={item?.text}
                      placeholder="Description"
                      allowedFormats={ALLOWED_FORMATS}
                      keepPlaceholderOnFocus={true}
                      onChange={(value) => {
                        let steps = [...attributes.steps];
                        steps[index]["text"] = value;
                        setAttributes({ steps: steps });
                      }}
                    />
                  </li>
                );
              })}
          </ul>
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
