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
  <button className="admin-buttom-move-item">
    <span class="dashicons dashicons-move"></span>
  </button>
));

const SortableItem = SortableElement((props) => {
  const { object, data_key, attributes, setAttributes, handlerDelete } = props;

  return (
    <li className="item" key={data_key}>
      <div className="btns">
        <button
          onClick={(event) => handlerDelete(event, data_key)}
          className="admin-buttom-delete-item"
        >
          <span class="dashicons dashicons-no"></span>
        </button>
        <DragHandle />
      </div>
      <RichText
        tagName="p"
        className="txt"
        value={object.text}
        allowedFormats={ALLOWED_FORMATS}
        placeholder="Text"
        keepPlaceholderOnFocus={true}
        onChange={(value) => {
          let newVisions = [...attributes?.visions];
          let newObj = { ...object, text: value };
          newVisions[data_key] = newObj;
          setAttributes({ visions: newVisions });
        }}
      />
    </li>
  );
});

const SortableList = SortableContainer((props) => {
  const { items, attributes, setAttributes, handlerAdd, handlerDelete } = props;

  return (
    <ul className="list">
      {items.length > 0 &&
        items.map(function (object, index) {
          return (
            <SortableItem
              key={`item-${index}`}
              value={object}
              object={object}
              index={index}
              data_key={index}
              attributes={attributes}
              setAttributes={setAttributes}
              handlerDelete={handlerDelete}
            />
          );
        })}
      <li className="item">
        <button class="admin-buttom-add-item" onClick={handlerAdd}>
          <span class="dashicons dashicons-plus-alt2"></span>
        </button>
      </li>
    </ul>
  );
});

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;

  const { title, guarantee_title, guarantee_txt, image, visions } = attributes;

  const handlerDelete = (event, index) => {
    event.stopPropagation();
    const newVisions = [...visions];
    newVisions.splice(index, 1);
    setAttributes({ visions: newVisions });
  };

  const handlerAdd = () => {
    const newVisions = [...visions];
    newVisions.push({ text: "..." });
    setAttributes({ visions: newVisions });
  };

  const handlerOnSortEnd = ({ oldIndex, newIndex }) => {
    let newVisions = [...visions];
    setAttributes({
      visions: arrayMoveImmutable(newVisions, oldIndex, newIndex),
    });
  };

  return (
    <Fragment>
      <div className="block block-guarantee">
        <div className="holder guarantee-inner">
          <div class="guarantee-head">
            <RichText
              tagName="h3"
              className="ttl"
              value={guarantee_title}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="description"
              keepPlaceholderOnFocus={true}
              onChange={(value) => setAttributes({ guarantee_title: value })}
            />

            <RichText
              tagName="p"
              className="txt"
              value={guarantee_txt}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="description"
              keepPlaceholderOnFocus={true}
              onChange={(value) => setAttributes({ guarantee_txt: value })}
            />
          </div>

          <div className="wrap">
            <ImageUploadSingle
              value={image}
              className="img"
              onChange={(value) => {
                if (!value) return false;
                setAttributes({
                  image: value,
                });
              }}
            />
            <div className="content">
              <div className="title">
                <RichText
                  tagName="h3"
                  className="ttl"
                  value={title}
                  allowedFormats={ALLOWED_FORMATS}
                  placeholder="description"
                  keepPlaceholderOnFocus={true}
                  onChange={(value) => setAttributes({ title: value })}
                />
              </div>
              <SortableList
                items={visions}
                onSortEnd={handlerOnSortEnd}
                axis="y"
                helperClass="hold-item-visions"
                hideSortableGhost={true}
                lockOffset={["100%"]}
                useDragHandle
                attributes={attributes}
                setAttributes={setAttributes}
                handlerAdd={handlerAdd}
                handlerDelete={handlerDelete}
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
