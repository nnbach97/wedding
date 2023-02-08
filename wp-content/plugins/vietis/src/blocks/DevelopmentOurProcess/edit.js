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

  const { title, steps } = attributes;

  const handleAdd = () => {
    let atts = [...attributes?.steps];
    atts.push({
      title: "",
      txt: ""
    });
    setAttributes({steps: atts});
  };

  const handleDelete = (index) => {
    let atts = [...attributes?.steps];
    atts.splice(index, 1);
    setAttributes({steps: atts});
  }

  return (
    <Fragment>
      <div class="block block-service-process">
        <div class="holder">
          <RichText
            value={title}
            tagName="p"
            className="title"
            onChange={(value) => {
              setAttributes({title: value});
            }}
          />
          <div class="wrap">
            <div class="line"></div>
            <div class="wrapper-item">
              {steps &&
                steps.map((item, index) => {
                  return (
                    <div class="item">
                      <div class="number">
                        <p class="txt">{index + 1 < 10 ? "0" + (index + 1) : (index + 1)}</p>
                      </div>
                      <div class="text">
                        <RichText
                          value={item?.title}
                          allowedFormats={ALLOWED_FORMATS}
                          tagName="p"
                          className="ttl"
                          placeholder="Enter your title here"
                          keepPlaceholderOnFocus={true}
                          onChange={(value) => {
                            let atts = [...attributes?.steps];
                            let new_title = {...item, title: value};
                            atts[index] = new_title;
                            setAttributes({steps: atts});
                          }}
                        />
                        <RichText
                          value={item?.txt}
                          allowedFormats={ALLOWED_FORMATS}
                          tagName="p"
                          className="txt"
                          placeholder="Enter your text here"
                          keepPlaceholderOnFocus={true}
                          onChange={(value) => {
                            let atts = [...attributes?.steps];
                            let new_title = {...item, txt: value};
                            atts[index] = new_title;
                            setAttributes({steps: atts});
                          }}
                        />
                      </div>
                      <div class="delete-area">
                        <button
                          onClick={() => handleDelete(index)}
                          className="admin-buttom-delete-item"
                        >
                          <span class="dashicons dashicons-no"></span>
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="item">
                  <button className="admin-buttom-add-item" onClick={handleAdd}><span class="dashicons dashicons-plus-alt"></span></button>
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
