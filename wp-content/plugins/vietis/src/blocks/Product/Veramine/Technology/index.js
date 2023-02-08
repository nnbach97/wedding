import { registerBlockType } from "@wordpress/blocks";
import "./style.scss";
import Edit from "./edit";

registerBlockType("create-block/veramine-technology", {
  title: "Veramine-technology",
  description: "Example block-technology Veramine",
  category: "vietis",
  icon: "dashicons dashicons-info",

  attributes: {
    bg_image: {
      type: "string",
      default:
        PV_Admin.PV_BASE_URL +
        "/assets/img/blocks/product/veramine/image_bg_feature.svg",
    },
    item: {
      type: "array",
      default: [
        {
          icon: {
            id: 1,
            alt: "",
            url:
              PV_Admin.PV_BASE_URL +
              "/assets/img/blocks/product/veramine/feature01.svg",
          },
          title: "高精度<br/>アルゴリズム",
          description:
            "膨大なデータをあらゆる角度から深く分析、サイバー攻撃の兆候をリアルタイムに検知・可視化し、標的型攻撃などの高度なサイバー攻撃を阻止します。",
          note: "Veramine Endpoint Detection日れdRes 0れse (VEDR)",
        },
        {
          icon: {
            id: 2,
            alt: "",
            url:
              PV_Admin.PV_BASE_URL +
              "/assets/img/blocks/product/veramine/feature03.svg",
          },
          title: "全てのエンドボイントをリアルタイムに監視",
          description:
            "企業が保有する数多くのエンドボイントに対し、マルウェアの感染や攻撃を検知し、影響範囲を特定、早期対応を実現します。",
          note: "Veramine P′Odu( ⅵ MOれ0 ng r00 (VPMT)",
        },
        {
          icon: {
            id: 3,
            alt: "",
            url:
              PV_Admin.PV_BASE_URL +
              "/assets/img/blocks/product/veramine/feature02.svg",
          },
          title: "Deception<br/>テクノロジー",
          description:
            'おとり環境へ標的型サイバー攻撃を誘導し攻撃者を・騙す"ソリューションで攻撃を 阻止します。',
          note: "Veramine DynamicDeception System (VDDS)",
        },
        {
          icon: {
            id: 4,
            alt: "",
            url:
              PV_Admin.PV_BASE_URL +
              "/assets/img/blocks/product/veramine/feature04.svg",
          },
          title: "内部のセキュリティ違反<br/>もすぐ検知",
          description:
            "あらゆるアクテイヒティをモ二タリングし悪意のあるすべての操作を検知できます。",
          note: "Veramine引de′ TわヨtPレeれ0 (VITP)",
        },
      ],
    },
    description: {
      type: "string",
      default:
        "昨今は、ゼロディ攻撃、標的型攻撃といった巧妙な手口を用いたサイバー攻撃が増えており、従来のセキュリティ対策ソフト( EPP)では攻撃を防ぐことが難しくなっています。<br>Veramineは、 会社が保有する全てのPC・ノートパソコン・サーバーの挙動を包括的にモニタリングすることができます。個々のデバイスではなく複数デバイスのデータを関連付けて分析するため、インシデント発生時にも感染経路や感染範囲を素早く特定し、被害を最小限に抑えることができます",
    },
    feature_text: {
      type: "string",
      default:
        "昨今は、ゼロディ攻撃、標的型攻撃といった巧妙な手口を用いたサイバー攻撃が増えており、従来のセキュリティ対策ソフト(EPP)では攻撃を防ぐことが難しくなっています。<br />Veramineは、会社が保有する全てのPC・ノートパソコン・サーバーの挙動を包括的にモニタリングすることができます。個々のデバイスではなく複数デバイスのデータを関連付けて分析するため、インシデント発生時にも感染経路や感染範囲を素早く特定し、被害を最小限に抑えることができます",
    },
    config: {
      type: "object",
      default: {},
    },
  },
  example: {},
  getEditWrapperProps() {
    return { "data-align": "full" };
  },
  edit: Edit,
});
