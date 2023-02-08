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
import { ConfigBlock } from "../../components/config-block";
import { ALLOWED_FORMATS } from "../../config/define";
import { ImageUploadSingle } from "../../components/image-upload";

const Control = function ({ props }) {
  const { attributes, setAttributes } = props;

  return (
    <>
      <InspectorControls key="settting">
        <PanelBody title="Cấu hình chung" initialOpen={true}>
          <div className="mb-3">
            <InputControl
              value={attributes.title_shadow}
              onChange={(value) => setAttributes({ title_shadow: value })}
              placeholder="Nhập tiêu đề chìm"
              label="Tiêu đề chìm"
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

  const { title, title_highlight, title_shadow, description, btn_learn_more, image } =
    attributes;

  return (
    <Fragment>
      <div class="block block-feature">
        <div class="holder feature-inner">
          <div class="wrap">
            <div class="content">
              <div class="title">
                <h3 class="ttl">
                  <RichText
                    tagName="span"
                    className="ttl-txt"
                    value={title}
                    allowedFormats={ALLOWED_FORMATS}
                    placeholder="description"
                    keepPlaceholderOnFocus={true}
                    onChange={(value) => setAttributes({ title: value })}
                  />
                  <br />
                  <RichText
                    tagName="span"
                    className="ttl--highlight"
                    value={title_highlight}
                    allowedFormats={ALLOWED_FORMATS}
                    placeholder="description"
                    keepPlaceholderOnFocus={true}
                    onChange={(value) =>
                      setAttributes({ title_highlight: value })
                    }
                  />
                </h3>
                <span className="shadow">{title_shadow}</span>
              </div>
              <RichText
                tagName="div"
                className="block-content des"
                value={description}
                allowedFormats={ALLOWED_FORMATS}
                placeholder="description"
                keepPlaceholderOnFocus={true}
                onChange={(value) => setAttributes({ description: value })}
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
