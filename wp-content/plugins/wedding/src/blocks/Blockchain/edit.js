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
import { Fragment, useCallback } from "@wordpress/element";
import { ALLOWED_FORMATS } from "../../config/define";
import { ConfigBlock, processConfig } from "../../components/config-block";
import { ImageUploadSingle } from "../../components/image-upload";
import { BaseColorControl } from "../../components/color-control";
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

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

const DragHandle = sortableHandle(() => (
  <span className="admin-buttom-move-item">
    <span class="dashicons dashicons-move"></span>
  </span>
));

const SortableItem = SortableElement((props) => {
  const { object, data_key, attributes, setAttributes, handlerDelete } = props;
  return (
    <div
      className="item"
      style={{
        "background": object?.color ? object?.color : "#F3F4FD",
      }}
    >
      <button
        onClick={() => handlerDelete(data_key)}
        className="admin-buttom-delete-item"
      >
        <span class="dashicons dashicons-no"></span>
      </button>
      <DragHandle />
      <BaseColorControl
        value={object?.color || "#F3F4FD"}
        colors={[
          { name: "Màu 1", color: "#F3F4FD" },
          { name: "Màu 2", color: "#EDFAFE" },
          { name: "Màu 3", color: "#EBF5FF" },
        ]}
        onChange={(value) => {
          let items = [...attributes?.items];
          let item = { ...object, color: value };
          items[data_key] = item;
          setAttributes({ items: items });
        }}
      />
      <div className="subtitle">
        <div className="image">
          <ImageUploadSingle
            value={object?.icon}
            className="img"
            onChange={(value) => {
              if (!value) return false;
              let atts=  [...attributes.items];
              atts[data_key]['icon'] = value;
              setAttributes({
                items: atts,
              });
            }}
          />
        </div>
        <RichText
          tagName="p"
          className="ttl"
          value={object?.ttl}
          allowedFormats={ALLOWED_FORMATS}
          placeholder="Title .."
          keepPlaceholderOnFocus={true}
          onChange={(value) => {
            let atts = [...attributes?.items];
            atts[data_key]['ttl'] = value;
            setAttributes({ items: atts })
          }}
        />
      </div>
      <RichText
        tagName="p"
        className="txt"
        value={object?.txt}
        allowedFormats={ALLOWED_FORMATS}
        placeholder="Text .."
        keepPlaceholderOnFocus={true}
        onChange={(value) => {
          let atts = [...attributes?.items];
          atts[data_key]['txt'] = value;
          setAttributes({ items: atts })
        }}
      />
    </div>
  );
});

const SortableList = SortableContainer((props) => {
  const { items, attributes, setAttributes, handlerAdd, handlerDelete } = props;
  return (
    <div className="wrapper-item">
      {items &&
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
    </div>
  );
});

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;

  const handlerAdd = function () {
    let datas = [...attributes.items];
    datas.push({
      icon: {},
      ttl: "<strong>Tiêu đề</strong>",
      txt: "Nội dung",
      color: "#F3F4FD",
    });
    setAttributes({ items: datas });
  };

  const handlerDelete = function (index) {
    let datas = [...attributes.items];
    datas.splice(index, 1);
    setAttributes({ items: datas });
  };

  let data = processConfig(attributes.config);

  const handlerOnSortEnd = ({ oldIndex, newIndex }) => {
    let items = [...attributes?.items];
    setAttributes({
      items: arrayMoveImmutable(items, oldIndex, newIndex),
    });
  };

  return (
    <Fragment>
      <div className="block block-blockchain" style={data?.style_block || {}}>
        <div className="wrap">
          <div className="holder">
            <RichText
              tagName="h4"
              className="title"
              value={attributes?.title}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="Tiêu đề"
              keepPlaceholderOnFocus={true}
              onChange={(value) => {
                setAttributes({ title: value });
              }}
            />
            <SortableList
              items={attributes?.items}
              onSortEnd={handlerOnSortEnd}
              axis="xy"
              helperClass="hold-item-blockchain"
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
