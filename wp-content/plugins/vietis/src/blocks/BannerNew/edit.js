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
              onChange={() => setAttributes({ is_show_btn_video: !attributes.is_show_btn_video })}
            />
          </div>
          <div className="mb-3 horizontal-wrap">
            <h2 className="ttl">Show background mobile:</h2>
            <FormToggle
              checked={attributes.is_show_bg}
              onChange={() => setAttributes({ is_show_bg: !attributes.is_show_bg })}
            />
          </div>

          <div className="mb-3">
            <Panel header="Video Background">
              <VideoUploadSingle
                value={attributes.video_background}
                className="video-wrap"
                onChange={(media) => {
                  setAttributes({ video_background: media.url });
                }}
                handleDeleteVideo={() =>
                  setAttributes({ video_background: "" })
                }
              />
            </Panel>
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
        className={`block block-banner-new${
          attributes.is_show_bg ? "" : " is-show-bg"
        }`}
      >
        <div className="banner-bg">
          <video
            className="video"
            preload="true"
            muted=""
            playsinline=""
            poster=""
            autoplay=""
            loop=""
            controls=""
          >
            <source src={attributes.video_background} type="video/mp4" />
          </video>
        </div>
        <div className="holder banner-inner">
          <div className="wrap">
            <RichText
              tagName="h2"
              className="ttl"
              value={attributes.title}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="In Pursuit of Excellence"
              keepPlaceholderOnFocus={true}
              onChange={(value) => setAttributes({ title: value })}
            />
            <RichText
              tagName="p"
              className="sub"
              value={attributes?.description}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="To be your long term Tech - Partner"
              keepPlaceholderOnFocus={true}
              onChange={(value) => setAttributes({ description: value })}
            />
            <div className="btn-wrapper">
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
            </div>
            <div className="certificate">
              <div class="img-wrap">
                <ImageUploadSingle
                  value={attributes?.certificate?.certificate_01}
                  className="img"
                  onChange={(value) => {
                    if (!value) return false;
                    setAttributes({
                      certificate: {
                        ...attributes?.certificate,
                        certificate_01: value,
                      },
                    });
                  }}
                />
              </div>
              <div class="img-wrap">
                <ImageUploadSingle
                  value={attributes?.certificate?.certificate_02}
                  className="img img-cmmi"
                  onChange={(value) => {
                    if (!value) return false;
                    setAttributes({
                      certificate: {
                        ...attributes?.certificate,
                        certificate_02: value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="block block-number">
        <img
          className="img img-number-bottom"
          src={`${PV_Admin.PV_BASE_URL}/assets/img/blocks/banner/bg-number.svg`}
          alt=""
        />
        <div class="number-inner">
          <div class="holder">
            <div class="counter">
              {attributes.counters &&
                attributes.counters.map(function (object, index) {
                  return (
                    <div className="item">
                      <div className="counter-number">
                        <RichText
                          tagName="span"
                          className=""
                          value={object.number}
                          allowedFormats={ALLOWED_FORMATS}
                          placeholder="Num"
                          keepPlaceholderOnFocus={true}
                          onChange={(value) => {
                            let counters = [...attributes.counters];
                            let counter = { ...object, number: value };
                            counters[index] = counter;
                            setAttributes({ counters: counters });
                          }}
                        />
                        <span>{index !== 0 && "+"}</span>
                      </div>
                      <RichText
                        tagName="div"
                        className="txt"
                        value={object.text}
                        allowedFormats={ALLOWED_FORMATS}
                        placeholder="Title"
                        keepPlaceholderOnFocus={true}
                        onChange={(value) => {
                          let counters = [...attributes.counters];
                          let counter = { ...object, text: value };
                          counters[index] = counter;
                          setAttributes({ counters: counters });
                        }}
                      />
                    </div>
                  );
                })}
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
