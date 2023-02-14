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
import { Fragment, useState } from "@wordpress/element";
import { ConfigBlock } from "../../components/config-block";
import { ALLOWED_FORMATS } from "../../config/define";
import { ImageUploadSingle } from "../../components/image-upload";
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

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

const DragHandle = sortableHandle(() => (
  <span className="admin-buttom-move-item">
    <span class="dashicons dashicons-move"></span>
  </span>
));

const SortableItem = SortableElement((props) => {
  const { object, data_key, attributes, setAttributes, handleDelete } = props;
  return (
    <div class="desc">
      <button className="admin-buttom-delete-item" onClick={() => handleDelete(data_key)}>
        <span class="dashicons dashicons-no"></span>
      </button>

      <ImageUploadSingle
        value={object?.icon}
        onChange={(value) => {
          let atts = [...attributes?.items];
          let new_image = { ...object, icon: value };
          atts[data_key] = new_image;
          setAttributes({ items: atts });
        }}
      />
      <div class="sub-desc">
      <DragHandle />
        <RichText
          tagName="p"
          className="ttl"
          value={object?.ttl}
          placeholder="Enter Subtitle.."
          keepPlaceholderOnFocus={true}
          onChange={(value) => {
            let atts = [...attributes?.items];
            let new_title = { ...object, ttl: value };
            atts[data_key] = new_title;
            setAttributes({ items: atts });
          }}
        />
        <RichText
          tagName="p"
          className="txt"
          placeholder="Enter Content.."
          keepPlaceholderOnFocus={true}
          value={object?.txt}
          onChange={(value) => {
            let atts = [...attributes?.items];
            let new_title = { ...object, txt: value };
            atts[data_key] = new_title;
            setAttributes({ items: atts });
          }}
        />
      </div>
    </div>
  );
});

const SortableList = SortableContainer((props) => {
  const { items, attributes, setAttributes, handleDelete, handleAdd } = props;
  return (
    <div class="application">
      {items && items.map((object, index) => {
        return (
          <SortableItem
            key={`item-${index}`}
            value={object}
            object={object}
            index={index}
            data_key={index}
            attributes={attributes}
            setAttributes={setAttributes}
            handleDelete={handleDelete}
          />
        );
      })}
      <div className="desc">
        <button className="admin-buttom-add-item" onClick={handleAdd}>
          <span class="dashicons dashicons-plus-alt2"></span>
        </button>
      </div>
    </div>
  )
})

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;

  const handleAdd = () => {
    let atts =[...attributes?.items];
    atts.push({
      icon: {
        url: "",
        alt: "",
        id: ""
      },
      ttl: "",
      txt: ""
    });
    setAttributes({items: atts});
  };

  const handleDelete = (index) => {
    let atts = [...attributes?.items];
    atts.splice(index, 1);
    setAttributes({items: atts});
  }

  const handlerOnSortEnd = ({ oldIndex, newIndex }) => {
    let items = [...attributes?.items];
    setAttributes({
      items: arrayMoveImmutable(items, oldIndex, newIndex),
    });
  };

  return (
    <Fragment>
      <div class="block block-mobile">
        <div class="wrap">
          <div class="holder">
            <div class="wrapper-item">
              <div class="item">
                <div class="subtitle">
                  <RichText
                    tagName="p"
                    className="ttl"
                    value={attributes?.title}
                    allowedFormats={ALLOWED_FORMATS}
                    placeholder="Enter Title ..."
                    keepPlaceholderOnFocus={true}
                    onChange={(value) => setAttributes({ title: value })}
                  />
                  <RichText
                    tagName="p"
                    className="txt"
                    value={attributes?.desc}
                    allowedFormats={ALLOWED_FORMATS}
                    placeholder="Enter Content ..."
                    keepPlaceholderOnFocus={true}
                    onChange={(value) => setAttributes({ desc: value })}
                  />
                </div>
                <div class="content">
                  <div class="image">
                    <ImageUploadSingle
                      value={attributes?.image}
                      className="img"
                      onChange={(value) => {
                        setAttributes({ image: value });
                      }}
                    />
                    <RichText
                      tagName="p"
                      className="ttl"
                      value={attributes?.image_txt}
                      onChange={(value) => {
                        setAttributes({ image_txt: value });
                      }}
                    />
                  </div>
                  <SortableList
                    items={attributes?.items}
                    onSortEnd={handlerOnSortEnd}
                    axis="xy"
                    helperClass="hold-item-mobile"
                    hideSortableGhost={true}
                    lockOffset={["100%"]}
                    useDragHandle
                    attributes={attributes}
                    setAttributes={setAttributes}
                    handleDelete={handleDelete}
                    handleAdd={handleAdd}
                  />
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
