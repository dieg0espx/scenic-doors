/** SVG diagram URLs for panel layout configurations (from Cloudinary) */
export const LAYOUT_IMAGES: Record<string, string> = {
  // 2 panels – sliding
  "2p_Operating + Fixed": "https://res.cloudinary.com/dku1gnuat/image/upload/v1771424018/operating_fixed_2_panels_b1ome8.svg",
  "2p_Fixed + Operating": "https://res.cloudinary.com/dku1gnuat/image/upload/v1771424017/fixed_operating_2_panels_cpqfou.svg",
  "2p_Both Fixed": "https://res.cloudinary.com/dku1gnuat/image/upload/v1771424015/both_fixed_2_panels_xzpkia.svg",
  // 3 panels – sliding
  "3p_Operating + Operating + Fixed": "https://res.cloudinary.com/dku1gnuat/image/upload/v1771424014/ope_ope_fixed_3_panels_mhgfll.svg",
  "3p_Operating + Fixed + Operating (L)": "https://res.cloudinary.com/dku1gnuat/image/upload/v1771424013/ope_fixed_ope_L_3_panels_a8bcei.svg",
  "3p_Operating + Fixed + Operating (R)": "https://res.cloudinary.com/dku1gnuat/image/upload/v1771424013/ope_fixed_ope_R_3_panels_nuvull.svg",
  "3p_Operating + Fixed + Fixed": "https://res.cloudinary.com/dku1gnuat/image/upload/v1771424012/ope_fix_fix_3_panels_r7vh6u.svg",
  "3p_Fixed + Operating + Fixed": "https://res.cloudinary.com/dku1gnuat/image/upload/v1771424011/fix_oper_fix_3_panels_wzfdl8.svg",
  "3p_Fixed + Fixed + Operating": "https://res.cloudinary.com/dku1gnuat/image/upload/v1771424010/fix_fix_ope_3_panels_wugpzr.svg",
  "3p_Fixed + Fixed + Operating (L)": "https://res.cloudinary.com/dku1gnuat/image/upload/v1771424009/fix_fix_ope_L_3_panels_n2bg5z.svg",
  "3p_All Fixed": "https://res.cloudinary.com/dku1gnuat/image/upload/v1771424009/all_fixed_3_panels_y0eox0.svg",
  // 4 panels – sliding
  "4p_Operating + Fixed + Fixed + Operating": "https://res.cloudinary.com/dku1gnuat/image/upload/v1771424359/ope_fix_fix_ope_4_panels_qnucnn.svg",
  // 6 panels – sliding
  "6p_Operating + Fixed + Fixed + Fixed + Fixed + Operating": "https://res.cloudinary.com/dku1gnuat/image/upload/v1771424358/op_fix_fix_1_fix_fix_ope_6_panels_ode3gv.svg",
};

export function getLayoutImageUrl(panelCount: number, layout: string): string | undefined {
  return LAYOUT_IMAGES[`${panelCount}p_${layout}`];
}
