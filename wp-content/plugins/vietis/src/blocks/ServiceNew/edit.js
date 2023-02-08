import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  RichText,
  InnerBlocks,
} from "@wordpress/block-editor";
import {
  PanelBody,
  __experimentalInputControl as InputControl,
  SelectControl,
} from "@wordpress/components";
import { Fragment, useEffect, useState } from "@wordpress/element";
import {
  POSTTYPE_POST,
  ORDER_BY_FIELD,
  ORDER,
  ALLOWED_FORMATS,
} from "../../config/define";
import { ConfigBlock, processConfig } from "../../components/config-block";
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { ImageUploadSingle } from "../../components/image-upload";
import { InputLink } from "../../components/input-link";

const DragHandle = sortableHandle(() => (
  <span className="admin-buttom-move-item">
    <span class="dashicons dashicons-move"></span>
  </span>
));

const SortableItem = SortableElement((props) => {
  const { object, data_key, attributes, setAttributes, handleDelete } = props;
  return (
    <div class="lnk">
      <div class="item-media">
        <button
          className="admin-buttom-delete-item"
          onClick={() => handleDelete(data_key)}
        >
          <span class="dashicons dashicons-no"></span>
        </button>
        <DragHandle />
        <InputLink
          value={object?.link || ""}
          onChange={(value) => {
            let items = [...attributes?.items];
            let item = { ...object, link: value };
            items[data_key] = item;
            setAttributes({ items: items });
          }}
        />
        <div class="image">
          <ImageUploadSingle
            value={object?.image}
            onChange={(value) => {
              let atts = [...attributes?.items];
              let new_image = { ...object, image: value };
              atts[data_key] = new_image;
              setAttributes({ items: atts });
            }}
          />
        </div>
        <div class="desc">
          <RichText
            tagName="div"
            className="heading"
            value={object?.ttl}
            placeholder="Your heading"
            keepPlaceholderOnFocus={true}
            onChange={(value) => {
              let atts = [...attributes?.items];
              let new_title = { ...object, ttl: value };
              atts[data_key] = new_title;
              setAttributes({ items: atts });
            }}
          />

          <RichText
            tagName="div"
            className="txt"
            value={object?.txt}
            placeholder="Your text"
            keepPlaceholderOnFocus={true}
            onChange={(value) => {
              let atts = [...attributes?.items];
              let new_txt = { ...object, txt: value };
              atts[data_key] = new_txt;
              setAttributes({ items: atts });
            }}
          />
        </div>
      </div>
    </div>
  );
});

const SortableList = SortableContainer((props) => {
  const { items, attributes, setAttributes, handleDelete, handleAdd } = props;
  return (
    <div class="wrapper-item">
      {items &&
        items.map((object, index) => {
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
      <button className="admin-buttom-add-item" onClick={handleAdd}>
        <span class="dashicons dashicons-plus-alt2"></span>
      </button>
    </div>
  );
});

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;

  let data = processConfig(attributes.config);

  const handleDelete = (index) => {
    let atts = [...attributes?.items];
    atts.splice(index, 1);
    setAttributes({ items: atts });
  };

  const handleAdd = () => {
    let atts = [...attributes?.items];
    atts.push({
      image: {
        url: "",
        alt: "",
        id: "",
      },
      ttl: "",
      txt: "",
    });
    setAttributes({ items: atts });
  };

  const handlerOnSortEnd = ({ oldIndex, newIndex }) => {
    let items = [...attributes?.items];
    setAttributes({
      items: arrayMoveImmutable(items, oldIndex, newIndex),
    });
  };

  return (
    <Fragment>
      <div className="block block-services-new" style={data?.style_block || {}}>
        <div className="holder">
          <div className="title text-center">
            <RichText
              tagName="h3"
              className="ttl"
              value={attributes?.title}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="Title"
              keepPlaceholderOnFocus={true}
              onChange={(value) => setAttributes({ title: value })}
            />
          </div>
          <div class="block-content">
            <InnerBlocks allowedBlocks={{}} />
          </div>
          <SortableList
            items={attributes?.items}
            onSortEnd={handlerOnSortEnd}
            axis="xy"
            helperClass="hold-item-service-new"
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
    </Fragment>
  );
};

export default function Edit(props) {
  return (
    <div {...useBlockProps()}>
      <FragmentBlock props={props}></FragmentBlock>
    </div>
  );
}
