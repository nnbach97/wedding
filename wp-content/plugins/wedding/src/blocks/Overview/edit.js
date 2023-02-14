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

  const { title, title_shadow, config} =
    attributes;

	let data = processConfig(attributes.config);
  return (
    <Fragment>
      <div class="block block-overview" style={data?.style_block || {}}>
        <div class="holder">
          <div class="wrap">
            <div class="title text-center">
              <RichText
                tagName="h3"
                className="ttl"
                value={attributes.title}
                allowedFormats={ALLOWED_FORMATS}
                placeholder="Title"
                keepPlaceholderOnFocus={true}
                onChange={(value) => setAttributes({ title: value })}
              />
              <span className="shadow">{attributes.title_shadow}</span>
            </div>

            <div class="wrapper-item">
              <div class="item">
                <div class="title">{PV_Admin.company_name_vi}</div>
                <div class="content">
                  <div class="text text--underline">
                    <p class="ttl">Year of incorporation</p>
                    <p class="txt">{PV_Admin.year_of_incorporation_vi}</p>
                  </div>
                  <div class="text text--underline">
                    <p class="ttl">Representative</p>
                    <p class="txt">{PV_Admin.representative_vi}</p>
                  </div>
                  <div class="text text--column">
                    <p class="ttl">Contact Info</p>
                    <p class="txt">{PV_Admin.address_vi}</p>
                  </div>
                  <div class="text">
                    <span>Tel: </span><span><a href="#">{PV_Admin.phone_vi}</a></span>
                  </div>
                </div>
              </div>

              <div class="item">
                <div class="title">{PV_Admin.company_name_jp}</div>
                <div class="content content--bg">
                  <div class="text text--underline">
                    <p class="ttl">Year of incorporation</p>
                    <p class="txt">{PV_Admin.year_of_incorporation_jp}</p>
                  </div>
                  <div class="text text--underline">
                    <p class="ttl">Representative</p>
                    <p class="txt">{PV_Admin.representative_jp}</p>
                  </div>
                  <div class="text text--column">
                    <p class="ttl">Contact Info</p>
                    <div class="address">
                      <p class="txt">{PV_Admin.address_jp_01}</p>
                      <p class="sub">{PV_Admin.address_jp_02}</p>
                    </div>
                  </div>
                  <div class="text">
                    <span>Tel: </span><span><a href="#">{PV_Admin.phone_jp}</a></span>
                  </div>
                </div>
              </div>

              <div class="item">
                <div class="title">{PV_Admin.company_name_us}</div>
                <div class="content content--center content--bg">
                  <div class="text text text--column">
                    <p class="ttl">Contact Info</p>
                    <p class="txt">{PV_Admin.address_us}</p>
                  </div>
                </div>
              </div>

              <div class="item">
                <div class="title">{PV_Admin.company_name_fin}</div>
                <div class="content content--center">
                  <div class="text">
                    <p class="ttl">Representative</p>
                    <p class="txt">{PV_Admin.representative_vi}</p>
                  </div>
                </div>
              </div>
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
