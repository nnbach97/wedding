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
import { ConfigBlock, processConfig } from "../../components/config-block";

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

  let data = processConfig(attributes.config);
  return (
    <Fragment>
      <div class="block block-about-banner" style={data?.style_block || {}}>
        <div class="holder">
          <div class="wrapper">
            <div class="content">
              <RichText
                tagName="h3"
                className="ttl"
                value={attributes?.ttl}
                allowedFormats={ALLOWED_FORMATS}
                placeholder="Title"
                keepPlaceholderOnFocus={true}
                onChange={(value) => setAttributes({ ttl: value })}
              />

              <RichText
                tagName="p"
                className="txt"
                value={attributes?.txt}
                allowedFormats={ALLOWED_FORMATS}
                placeholder="Title"
                keepPlaceholderOnFocus={true}
                onChange={(value) => setAttributes({ txt: value })}
              />

              <div class="role">
                <RichText
                  tagName="p"
                  className="desc"
                  value={attributes?.role}
                  allowedFormats={ALLOWED_FORMATS}
                  placeholder="Title"
                  keepPlaceholderOnFocus={true}
                  onChange={(value) => setAttributes({ role: value })}
                />
              </div>
            </div>

            <div class="img">
              <img
                src={
                  PV_Admin.PV_BASE_URL +
                  "/assets/img/blocks/about-banner/about-img01.png"
                }
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
