import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from "@wordpress/block-editor";
import { PanelBody, Panel, FormToggle } from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import { ALLOWED_FORMATS } from "../../config/define";
import { ConfigBlock } from "../../components/config-block";
import { ImageUploadSingle } from "../../components/image-upload";
import { VideoUploadSingle } from "../../components/video-upload";

const Control = function ({ props }) {
  const { attributes, setAttributes } = props;

  return (
    <>
      <InspectorControls key="settting">
        <PanelBody title="Cấu hình chung" initialOpen={true}>
          <div className="mb-3 horizontal-wrap">
            <h2 className="ttl">Show button video:</h2>
            <FormToggle
              checked={attributes.is_show_btn_video}
              onChange={() =>
                setAttributes({
                  is_show_btn_video: !attributes.is_show_btn_video,
                })
              }
            />
          </div>
          <div className="mb-3 horizontal-wrap">
            <h2 className="ttl">Show background mobile:</h2>
            <FormToggle
              checked={attributes.is_show_bg}
              onChange={() =>
                setAttributes({ is_show_bg: !attributes.is_show_bg })
              }
            />
          </div>

          <div className="mb-3">
            <Panel header="Video Film">
              <VideoUploadSingle
                value={attributes.video_film}
                className="video-wrap"
                onChange={(media) => {
                  setAttributes({ video_film: media.url });
                }}
                handleDeleteVideo={() => setAttributes({ video_film: "" })}
              />
            </Panel>
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
      <div
        className={`block block-banner-new-img${
          attributes.is_show_bg ? "" : " is-show-bg"
        }`}
      >
        <div className="banner-bg">
          <ImageUploadSingle
            value={attributes?.img_banner}
            className="banner-bg__img"
            onChange={(value) => {
              if (!value) return false;
              setAttributes({
                ...attributes?.img_banner,
                img_banner: value,
              });
            }}
          />
        </div>
        <div className="holder banner-inner">
          <div className="wrap">
            <RichText
              tagName="p"
              className="sub"
              value={attributes.title}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="We’re Getting Married"
              keepPlaceholderOnFocus={true}
              onChange={(value) => setAttributes({ title: value })}
            />
            <RichText
              tagName="h2"
              className="ttl"
              value={attributes?.description}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="Ngọc Bách & Huyền Trang"
              keepPlaceholderOnFocus={true}
              onChange={(value) => setAttributes({ description: value })}
            />
            <RichText
              tagName="p"
              className="sub"
              value={attributes?.date}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="12 March 2023"
              keepPlaceholderOnFocus={true}
              onChange={(value) => setAttributes({ date: value })}
            />
            <RichText
              tagName="p"
              className="sub"
              value={attributes?.countdown}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="03/12"
              keepPlaceholderOnFocus={true}
              onChange={(value) => setAttributes({ countdown: value })}
            />
            {/* <div className="btn-wrapper">
              {attributes.is_show_btn_video ? (
                <div className="video-btn">
                  <div className="video-mark">
                    <div className="wave-pulse wave-pulse-1"></div>
                    <div className="wave-pulse wave-pulse-2"></div>
                  </div>
                  <div className="video-click">
                    <div className="video-play">
                      <span className="video-play-icon"></span>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="item">
                <span className="icon">
                  <ImageUploadSingle
                    value={attributes?.btn_inquiry?.icon}
                    className="img"
                    onChange={(value) => {
                      if (!value) return false;
                      setAttributes({
                        btn_inquiry: {
                          ...attributes?.btn_inquiry,
                          icon: value,
                        },
                      });
                    }}
                  />
                </span>
                <RichText
                  tagName="span"
                  className="url"
                  value={attributes.btn_inquiry?.text}
                  allowedFormats={ALLOWED_FORMATS}
                  placeholder="Inquiry"
                  keepPlaceholderOnFocus={true}
                  onChange={(value) =>
                    setAttributes({
                      btn_inquiry: {
                        ...attributes?.btn_inquiry,
                        text: value,
                      },
                    })
                  }
                />
              </div>
            </div> */}
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
