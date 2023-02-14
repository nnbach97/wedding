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
import { ImageUpload } from "../../../../components/image-upload";
import {
  ConfigBlock,
} from "../../../../components/config-block";

const Control = function ({ props }) {
  const { attributes, setAttributes } = props;

  return (
    <>
      <InspectorControls key="settting">
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
      <div className="block block-product-banner js-hero">
        <div className="holder-fluid banner-inner">
          <div className="img-wrap">
            <ImageUploadSingle
              value={attributes?.image}
              className="img"
              onChange={(media) => {
                setAttributes({ image: media });
              }}
            />
          </div>
          <div className="content">
            <RichText
              className="ttl"
              tagName="h2"
              value={attributes?.title}
              placeholder="Tiêu đề"
              keepPlaceholderOnFocus={true}
              allowedFormats={ALLOWED_FORMATS}
              onChange={(value) => {
                setAttributes({ title: value });
              }}
            />
            <RichText
              className="des"
              value={attributes?.description}
              placeholder="Mô tả"
              keepPlaceholderOnFocus={true}
              allowedFormats={ALLOWED_FORMATS}
              onChange={(value) => {
                setAttributes({ description: value });
              }}
            />
            <ul className="product-insight-implement">
              {attributes.steps &&
                attributes.steps.map((item, index) => {
                  return (
                    <li className="item">
                      <span className="number">{item.id}</span>
                      <RichText
                        tagName="span"
                        className="txt"
                        value={attributes?.steps[index]["text"]}
                        placeholder="Mô tả"
                        keepPlaceholderOnFocus={true}
                        allowedFormats={ALLOWED_FORMATS}
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
      </div>
      <div class="block block-technology">
        <div class="holder list">
          <ImageUpload
            value={attributes?.technology}
            multiple={true}
            className="item"
            tagName="div"
            onChange={(value) => {
              if (!value) return false;
              setAttributes({ technology: value });
            }}
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
