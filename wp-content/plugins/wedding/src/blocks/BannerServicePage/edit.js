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
      <div className="block block-service-banner js-hero">
        <div className="holder banner-inner">
          <RichText
            tagName="h2"
            className="ttl"
            value={attributes.title}
            allowedFormats={ALLOWED_FORMATS}
            placeholder="Title"
            keepPlaceholderOnFocus={true}
            onChange={(value) => setAttributes({ title: value })}
          />
          <RichText
            tagName="div"
            className="des"
            value={attributes.description}
            allowedFormats={ALLOWED_FORMATS}
            placeholder="Description"
            keepPlaceholderOnFocus={true}
            onChange={(value) => setAttributes({ description: value })}
          />
        </div>
      </div>

      {/* Process */}
      <div className="block block-process">
        <div className="holder process">
          <div className="ttl-wrap">
            <RichText
              tagName="h2"
              className="ttl"
              value={attributes.title_process}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="Process main service"
              keepPlaceholderOnFocus={true}
              onChange={(value) => setAttributes({ title_process: value })}
            />
          </div>
          <div className="process-left">
            <div className="process-left-block process-left-block--first">
              <div className="process-left-item">
                <div className="txt-wrap">
                  <RichText
                    tagName="div"
                    className="process-left-item__txt"
                    value={attributes.list_text_process.text1}
                    allowedFormats={ALLOWED_FORMATS}
                    placeholder=""
                    keepPlaceholderOnFocus={true}
                    onChange={(value) =>
                      setAttributes({
                        list_text_process: {
                          ...attributes.list_text_process,
                          text1: value,
                        },
                      })
                    }
                  />
                </div>
                <div className="process-num">
                  <div className="process-num-in">
                    <div>01</div>
                  </div>
                </div>
              </div>
              <img
                className="img"
                src={
                  PV_Admin.PV_BASE_URL +
                  "assets/img/blocks/banner-service-page/dash_01_left.svg"
                }
                alt=""
              />
            </div>
            <div className="process-left-block process-left-block--second">
              <div className="process-left-item">
                <div className="txt-wrap">
                  <RichText
                    tagName="div"
                    className="process-left-item__txt"
                    value={attributes.list_text_process.text2}
                    allowedFormats={ALLOWED_FORMATS}
                    placeholder=""
                    keepPlaceholderOnFocus={true}
                    onChange={(value) =>
                      setAttributes({
                        list_text_process: {
                          ...attributes.list_text_process,
                          text2: value,
                        },
                      })
                    }
                  />
                </div>
                <div className="process-num">
                  <div className="process-num-in">
                    <div>02</div>
                  </div>
                </div>
              </div>
              <img
                className="img"
                src={
                  PV_Admin.PV_BASE_URL +
                  "assets/img/blocks/banner-service-page/dash_02_left.svg"
                }
                alt=""
              />
            </div>
            <div className="process-left-block process-left-block--third">
              <div className="process-left-item">
                <div className="txt-wrap">
                  <RichText
                    tagName="div"
                    className="process-left-item__txt"
                    value={attributes.list_text_process.text3}
                    allowedFormats={ALLOWED_FORMATS}
                    placeholder=""
                    keepPlaceholderOnFocus={true}
                    onChange={(value) =>
                      setAttributes({
                        list_text_process: {
                          ...attributes.list_text_process,
                          text3: value,
                        },
                      })
                    }
                  />
                </div>
                <div className="process-num">
                  <div className="process-num-in">
                    <div>03</div>
                  </div>
                </div>
              </div>
              <img
                className="img"
                src={
                  PV_Admin.PV_BASE_URL +
                  "assets/img/blocks/banner-service-page/dash_03_left.svg"
                }
                alt=""
              />
            </div>
            <div className="process-left-block process-left-block--fourth">
              <div className="process-left-item">
                <div className="txt-wrap">
                  <RichText
                    tagName="div"
                    className="process-left-item__txt"
                    value={attributes.list_text_process.text4}
                    allowedFormats={ALLOWED_FORMATS}
                    placeholder=""
                    keepPlaceholderOnFocus={true}
                    onChange={(value) =>
                      setAttributes({
                        list_text_process: {
                          ...attributes.list_text_process,
                          text4: value,
                        },
                      })
                    }
                  />
                </div>
                <div className="process-num">
                  <div className="process-num-in">
                    <div>04</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="process-mid">
            <img
              className=""
              src={
                PV_Admin.PV_BASE_URL +
                "assets/img/blocks/banner-service-page/dash_mid_top.svg"
              }
              alt=""
            />
            <img
              className=""
              src={
                PV_Admin.PV_BASE_URL +
                "assets/img/blocks/banner-service-page/dash_mid_bottom.svg"
              }
              alt=""
            />
          </div>

          <div className="process-right">
            <div className="process-right-block process-right-block--first">
              <div className="process-right-item">
                <div className="process-num">
                  <div className="process-num-in">
                    <div>08</div>
                  </div>
                </div>
                <div className="txt-wrap">
                  <RichText
                    tagName="div"
                    className="process-right-item__txt"
                    value={attributes.list_text_process.text8}
                    allowedFormats={ALLOWED_FORMATS}
                    placeholder=""
                    keepPlaceholderOnFocus={true}
                    onChange={(value) =>
                      setAttributes({
                        list_text_process: {
                          ...attributes.list_text_process,
                          text8: value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <img
                className="img"
                src={
                  PV_Admin.PV_BASE_URL +
                  "assets/img/blocks/banner-service-page/dash_03_right.svg"
                }
                alt=""
              />
            </div>
            <div className="process-right-block process-right-block--second">
              <div className="process-right-item">
                <div className="process-num">
                  <div className="process-num-in">
                    <div>07</div>
                  </div>
                </div>
                <div className="txt-wrap">
                  <RichText
                    tagName="div"
                    className="process-right-item__txt"
                    value={attributes.list_text_process.text7}
                    allowedFormats={ALLOWED_FORMATS}
                    placeholder=""
                    keepPlaceholderOnFocus={true}
                    onChange={(value) =>
                      setAttributes({
                        list_text_process: {
                          ...attributes.list_text_process,
                          text7: value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <img
                className="img"
                src={
                  PV_Admin.PV_BASE_URL +
                  "assets/img/blocks/banner-service-page/dash_02_right.svg"
                }
                alt=""
              />
            </div>
            <div className="process-right-block process-right-block--third">
              <div className="process-right-item">
                <div className="process-num">
                  <div className="process-num-in">
                    <div>06</div>
                  </div>
                </div>
                <div className="txt-wrap">
                  <RichText
                    tagName="div"
                    className="process-right-item__txt"
                    value={attributes.list_text_process.text6}
                    allowedFormats={ALLOWED_FORMATS}
                    placeholder=""
                    keepPlaceholderOnFocus={true}
                    onChange={(value) =>
                      setAttributes({
                        list_text_process: {
                          ...attributes.list_text_process,
                          text6: value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <img
                className="img"
                src={
                  PV_Admin.PV_BASE_URL +
                  "assets/img/blocks/banner-service-page/dash_01_right.svg"
                }
                alt=""
              />
            </div>
            <div className="process-right-block process-right-block--fourth">
              <div className="process-right-item">
                <div className="process-num">
                  <div className="process-num-in">
                    <div>05</div>
                  </div>
                </div>
                <div className="txt-wrap">
                  <RichText
                    tagName="div"
                    className="process-right-item__txt"
                    value={attributes.list_text_process.text5}
                    allowedFormats={ALLOWED_FORMATS}
                    placeholder=""
                    keepPlaceholderOnFocus={true}
                    onChange={(value) =>
                      setAttributes({
                        list_text_process: {
                          ...attributes.list_text_process,
                          text5: value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* END: Process */}
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
