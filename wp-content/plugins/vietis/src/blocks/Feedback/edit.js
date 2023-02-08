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
import { Fragment, useState, useEffect } from "@wordpress/element";
import { ALLOWED_FORMATS } from "../../config/define";
import { ConfigBlock, processConfig } from "../../components/config-block";
import { ImageUploadSingle, ImageUpload } from "../../components/image-upload";

const Control = function ({ props }) {
  const { attributes, setAttributes } = props;
  return (
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
  );
};

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;
  const [slideItem, setSlideItem] = useState(0);

  const handlerAdd = function () {
    let datas = [...attributes.items];
    datas.push({ icon: {}, text: "Content...", name: "Company Name.." });
    setAttributes({ items: datas });

    handleShowSlide(attributes.items.length);
  };

  const handlerDelete = function (index) {
    let datas = [...attributes.items];
    datas.splice(index, 1);

    if (index == attributes.items.length - 1) {
      handleShowSlide(index - 1);
    }

    setAttributes({ items: datas });
  };

  const handleShowSlide = function (index) {
    setSlideItem(index);
    return;
  };

  let data = processConfig(attributes.config);
  return (
    <Fragment>
      <div class="block block-feedback" style={data?.style_block || {}}>
        <div class="holder">
          <div class="wrapper">
            <div class="img">
              <img
                src={
                  PV_Admin.PV_BASE_URL +
                  "/assets/img/blocks/feedback/feedback_img01.png"
                }
              />
            </div>
            <div class="content">
              <div class="title">
                <RichText
                  tagName="h3"
                  className="ttl"
                  value={attributes?.title}
                  allowedFormats={ALLOWED_FORMATS}
                  placeholder="Title"
                  keepPlaceholderOnFocus={true}
                  onChange={(value) => setAttributes({ title: value })}
                />
                <span className="shadow">{attributes?.title_shadow}</span>
              </div>

              <div class="slider js-slick-feedback">
                {attributes?.items.length > 0 &&
                  attributes?.items.map((item, index) => {
                    return (
                      <>
                        {slideItem == index && (
                          <div class="item">
                            <RichText
                              tagName="p"
                              className="txt"
                              value={attributes?.items[index]["text"]}
                              allowedFormats={ALLOWED_FORMATS}
                              placeholder="Text"
                              keepPlaceholderOnFocus={true}
                              onChange={(value) => {
                                if (!value) return "";
                                let att = [...attributes?.items];
                                att[index]["text"] = value.trim();
                                setAttributes({ items: att });
                              }}
                            />
                            <div class="author">
                              <ImageUploadSingle
                                className="avt"
                                value={item?.icon}
                                multiple={false}
                                onChange={(value) => {
                                  if (!value) return false;
                                  let items = [...attributes?.items];
                                  let img = { ...item, icon: value };
                                  console.log(img);
                                  items[index] = img;
                                  setAttributes({ items: items });
                                }}
                              />
                              <RichText
                                tagName="span"
                                className="name"
                                value={attributes?.items[index]["name"]}
                                allowedFormats={ALLOWED_FORMATS}
                                placeholder="Name"
                                keepPlaceholderOnFocus={true}
                                onChange={(value) => {
                                  if (!value) return "";
                                  let att = [...attributes?.items];
                                  att[index]["name"] = value.trim();
                                  setAttributes({ items: att });
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })}
              </div>
              <ul class="slick-dots">
                {attributes?.items &&
                  attributes?.items.map((item, index) => {
                    return (
                      <li class={`slick ${slideItem == index ? "active" : ""}`}>
                        <button
                          class="btn"
                          onClick={() => handleShowSlide(index)}
                        ></button>

                        <button
                          onClick={() => handlerDelete(index)}
                          className={`admin-buttom-delete-item item-${index}`}
                        >
                          <span class="dashicons dashicons-no"></span>
                        </button>
                      </li>
                    );
                  })}
                <li>
                  <div className="item button-add">
                    <div className="wrap">
                      <button
                        onClick={() => handlerAdd()}
                        className="admin-buttom-add-item"
                      >
                        <span class="dashicons dashicons-plus-alt2"></span>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
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
