import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from "@wordpress/block-editor";
import {
  PanelBody,
  __experimentalInputControl as InputControl,
  SelectControl,
} from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import { ALLOWED_FORMATS } from "../../config/define";
import { ConfigBlock, processConfig } from "../../components/config-block";
import { ImageUploadSingle } from "../../components/image-upload";

const Control = function ({ props }) {
  const { attributes, setAttributes } = props;

  const option = [
    { label: "Left", value: "left" },
    { label: "Right", value: "right" },
  ];

  return (
    <InspectorControls key="settting">
      <PanelBody title="Cấu hình block" initialOpen={true}>
        <ConfigBlock data={attributes} setData={setAttributes} />
      </PanelBody>
      <PanelBody title="Id Block">
        <InputControl
          value={attributes?.id}
          onChange={(value) => setAttributes({ id: value })}
          placeholder="Nhập id block"
        />
      </PanelBody>
      <PanelBody title="Layout Block Option:">
        <SelectControl
          options={option}
          value={attributes?.reverse}
          onChange={(value) => {
            setAttributes({ reverse: value });
          }}
        />
      </PanelBody>
    </InspectorControls>
  );
};

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;
  const { ttl, txt, image } = attributes;

  let data = processConfig(attributes.config);
  return (
    <Fragment>
      <div class="block-service-page">
        <div
          className={
            attributes?.reverse && attributes?.reverse === "right"
              ? "head"
              : "head head--reverse"
          }
        >
          <div class="holder">
            <div class="wrap">
              <div class="content" style={data?.style_block || {}}>
                <div class="title">
                  <h3 class="ttl">
                    <RichText
                      tagName="h3"
                      className="ttl"
                      value={ttl}
                      allowedFormats={ALLOWED_FORMATS}
                      placeholder="Title .."
                      keepPlaceholderOnFocus={true}
                      onChange={(value) => setAttributes({ ttl: value })}
                    />
                  </h3>
                </div>
                <RichText
                  tagName="p"
                  className="txt"
                  value={txt}
                  allowedFormats={ALLOWED_FORMATS}
                  placeholder="Description .."
                  keepPlaceholderOnFocus={true}
                  onChange={(value) => setAttributes({ txt: value })}
                />
                <RichText
                  tagName="p"
                  className="date"
                  value={txt}
                  allowedFormats={ALLOWED_FORMATS}
                  placeholder="Description .."
                  keepPlaceholderOnFocus={true}
                  onChange={(value) => setAttributes({ date: value })}
                />
              </div>

              <ImageUploadSingle
                value={image}
                className="img"
                onChange={(value) => {
                  if (!value) return false;
                  setAttributes({
                    image: value,
                  });
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
