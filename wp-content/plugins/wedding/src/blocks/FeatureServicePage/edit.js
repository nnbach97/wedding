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
    <>
      <InspectorControls key="settting">
        <PanelBody title="Cấu hình chung" initialOpen={true}></PanelBody>
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
      <div className="block block-feature-service-page">
        <div className="holder wrap">
          <ul className="content-features">
            {attributes.content.length > 0 &&
              attributes.content.map((item, index) => {
                return (
                  <li className="item">
                    <div className="img-wrap">
                      <ImageUploadSingle
                        value={item.icon}
                        className=""
                        onChange={(value) => {
                          if (!value) return false;
                          const newContent = [...attributes.content];
                          newContent[index].icon = value;

                          setAttributes({ content: newContent });
                        }}
                      />
                    </div>
                    <div class="desc">
                      <RichText
                        tagName="div"
                        className="txt"
                        value={item.title}
                        allowedFormats={ALLOWED_FORMATS}
                        placeholder="Title"
                        keepPlaceholderOnFocus={true}
                        onChange={(value) => {
                          const newContent = [...attributes.content];
                          newContent[index].title = value;
                          setAttributes({ content: newContent });
                        }}
                      />
                      <RichText
                        tagName="p"
                        className="date"
                        value={item.date}
                        allowedFormats={ALLOWED_FORMATS}
                        placeholder="Date"
                        keepPlaceholderOnFocus={true}
                        onChange={(value) => {
                          const newContent = [...attributes.content];
                          newContent[index].date = value;
                          setAttributes({ content: newContent });
                        }}
                      />
                      <RichText
                        tagName="p"
                        className="address"
                        value={item.address}
                        allowedFormats={ALLOWED_FORMATS}
                        placeholder="address"
                        keepPlaceholderOnFocus={true}
                        onChange={(value) => {
                          const newContent = [...attributes.content];
                          newContent[index].address = value;
                          setAttributes({ content: newContent });
                        }}
                      />
                    </div>
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
