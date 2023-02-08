import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from "@wordpress/block-editor";
import {
  PanelBody,
  Panel,
  __experimentalInputControl as InputControl,
} from "@wordpress/components";
import { Fragment, useCallback } from "@wordpress/element";
import { ALLOWED_FORMATS } from "../../config/define";
import { ConfigBlock, processConfig } from "../../components/config-block";
import { ImageUploadSingle } from "../../components/image-upload";
import { BaseColorControl } from "../../components/color-control";
import { ImageBgUpload } from "../../components/image-bg-upload";

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
      <div className="mb-3 setup-img">
        <Panel header="Image">
          <ImageBgUpload
            value={attributes.img_background}
            className="img"
            onChange={(media) => {
              setAttributes({ img_background: media.url });
            }}
            handleDeleteImage={() => setAttributes({ img_background: "" })}
          />
        </Panel>
      </div>
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
    <div className="item">
      <div
        className="wrap"
        style={{
          background: object?.color ? object?.color : "#F3F4FD",
        }}
      >
        <div className="icon">
          <img
            src={
              PV_Admin.PV_BASE_URL +
              "/assets/img/blocks/certificate/certificate_ico.png"
            }
          />
        </div>
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
            { name: "Màu 4", color: "#FFFFFF" },
          ]}
          onChange={(value) => {
            let items = [...attributes?.items];
            let item = { ...object, color: value };
            items[data_key] = item;
            setAttributes({ items: items });
          }}
        />
        <div className="image">
          <ImageUploadSingle
            value={object?.image}
            className="img"
            onChange={(value) => {
              let items = [...attributes?.items];
              let item = { ...object, image: value };
              items[data_key] = item;
              setAttributes({ items: items });
            }}
          />
        </div>
        <div className="text">
          <RichText
            tagName="div"
            className="ttl"
            value={object?.ttl}
            allowedFormats={ALLOWED_FORMATS}
            placeholder="Tiêu đề"
            keepPlaceholderOnFocus={true}
            onChange={(value) => {
              let items = [...attributes?.items];
              let item = { ...object, ttl: value };
              items[data_key] = item;
              setAttributes({ items: items });
            }}
          />
          <RichText
            tagName="div"
            className="txt"
            value={object?.txt}
            allowedFormats={ALLOWED_FORMATS}
            placeholder="Nội dung"
            keepPlaceholderOnFocus={true}
            onChange={(value) => {
              let items = [...attributes?.items];
              let item = { ...object, txt: value };
              items[data_key] = item;
              setAttributes({ items: items });
            }}
          />
        </div>
      </div>
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
      image: {},
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
      <div className="block block-certificate">
        <div className="overlay" style={data?.style_block || {}}></div>
        <div className="img-bg">
          <img className="img" src={attributes.img_background} alt="" />
        </div>
        <div className="holder">
          <SortableList
            items={attributes?.items}
            onSortEnd={handlerOnSortEnd}
            axis="xy"
            helperClass="hold-item-certificate"
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
