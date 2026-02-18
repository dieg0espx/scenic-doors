/** SVG diagram URLs for panel layout configurations (from Cloudinary) */

const C = "https://res.cloudinary.com/dku1gnuat/image/upload";

/* ── Sliding layouts (multi-slide-pocket & ultra-slim share these) ── */

const SLIDING_IMAGES: Record<string, string> = {
  // 2 panels
  "2p_Operating + Fixed": `${C}/v1771424018/operating_fixed_2_panels_b1ome8.svg`,
  "2p_Fixed + Operating": `${C}/v1771424017/fixed_operating_2_panels_cpqfou.svg`,
  "2p_Both Fixed": `${C}/v1771424015/both_fixed_2_panels_xzpkia.svg`,
  // 3 panels
  "3p_Operating + Operating + Fixed": `${C}/v1771424014/ope_ope_fixed_3_panels_mhgfll.svg`,
  "3p_Operating + Fixed + Operating (L)": `${C}/v1771424013/ope_fixed_ope_L_3_panels_a8bcei.svg`,
  "3p_Operating + Fixed + Operating (R)": `${C}/v1771424013/ope_fixed_ope_R_3_panels_nuvull.svg`,
  "3p_Operating + Fixed + Fixed": `${C}/v1771424012/ope_fix_fix_3_panels_r7vh6u.svg`,
  "3p_Fixed + Operating + Fixed": `${C}/v1771424011/fix_oper_fix_3_panels_wzfdl8.svg`,
  "3p_Fixed + Fixed + Operating": `${C}/v1771424010/fix_fix_ope_3_panels_wugpzr.svg`,
  "3p_Fixed + Fixed + Operating (L)": `${C}/v1771424009/fix_fix_ope_L_3_panels_n2bg5z.svg`,
  "3p_All Fixed": `${C}/v1771424009/all_fixed_3_panels_y0eox0.svg`,
  // 4 panels
  "4p_Operating + Fixed + Fixed + Operating": `${C}/v1771424359/ope_fix_fix_ope_4_panels_qnucnn.svg`,
};

/* ── Bi-Fold layouts ────────────────────────────────────── */

const BIFOLD_IMAGES: Record<string, string> = {
  // 2 panels
  "2p_All Left (2L)": `${C}/v1771426369/All_Left_2L_2_panels_nk3kwf.svg`,
  "2p_All Right (2R)": `${C}/v1771426375/All_Right_2R_2_Panels_ri5may.svg`,
  "2p_Split 1L-1R": `${C}/v1771426371/Split_1L_-_1R_2_Panels_ooehxc.svg`,
  // 3 panels
  "3p_All Left (3L)": `${C}/v1771426374/All_Left_3_Panels_tjmeuk.svg`,
  "3p_All Right (3R)": `${C}/v1771426368/All_Right_3R_3_panels_rcrhro.svg`,
  // 4 panels
  "4p_All Left (4L)": `${C}/v1771426366/All_Left_4L_4_Panels_no5jlx.svg`,
  "4p_All Right (4R)": `${C}/v1771426367/All_Right_4R_4_Panels_ax6qfw.svg`,
  "4p_Split 2L-2R": `${C}/v1771426390/Split_2L-2R_4_Panels_gz8cwo.svg`,
  // 5 panels
  "5p_All Left (5L)": `${C}/v1771426388/All_Left_5L_5_Panels_jxxbx0.svg`,
  "5p_All Right (5R)": `${C}/v1771426386/All_Right_5R_5_Panels_mvqebd.svg`,
  // 6 panels
  "6p_All Left (6L)": `${C}/v1771426392/All_Left_6L_6_Panels_mpvhpb.svg`,
  "6p_All Right (6R)": `${C}/v1771426383/All_Right_6R_6_Panels_iends9.svg`,
  "6p_Split 3L-3R": `${C}/v1771426385/Split_3L-3R_6_Panels_fxwca6.svg`,
  // 7 panels
  "7p_All Left (7L)": `${C}/v1771426382/All_Left_7L_7_Panels_dga2bg.svg`,
  "7p_All Right (7R)": `${C}/v1771426378/All_Right_7R_7_Panels_fxy1ua.svg`,
  // 8 panels
  "8p_All Left (8L)": `${C}/v1771426380/All_Left_8L_8_Panels_yuxws5.svg`,
  "8p_All Right (8R)": `${C}/v1771426377/All_Right_8R_8_Panels_enyka0.svg`,
  "8p_Split 4L-4R": `${C}/v1771426372/Split_4L_-_4R_8_Panels_mpnyrj.svg`,
};

/* ── Slide & Stack layouts ──────────────────────────────── */

const SLIDE_STACK_IMAGES: Record<string, string> = {
  // 2 panels
  "2p_1L + 1R": `${C}/v1771426864/1L_1R_2_panels_xgiad1.svg`,
  "2p_2L": `${C}/v1771426867/2L_2_panels_tc8ukm.svg`,
  "2p_2R": `${C}/v1771426862/2R_2_panels_nbzbud.svg`,
  // 3 panels
  "3p_All Left (3L)": `${C}/v1771426882/All_Left_3L_3_panels_i2qkxj.svg`,
  "3p_All Right (3R)": `${C}/v1771426885/All_Right_3R_3_panels_bftbi1.svg`,
  // 4 panels
  "4p_All Left (4L)": `${C}/v1771426860/All_Left_4L_4_panels_updifu.svg`,
  "4p_All Right (4R)": `${C}/v1771426861/All_Right_4R_4_panels_v9ava5.svg`,
  // 5 panels
  "5p_All Left (5L)": `${C}/v1771426889/All_Left_5L_5_panels_haa6i7.svg`,
  "5p_All Right (5R)": `${C}/v1771426891/All_Right_5R_5_panels_ytbl71.svg`,
  // 6 panels
  "6p_All Left (6L)": `${C}/v1771426885/All_Left_6L_6_panels_rglatx.svg`,
  "6p_All Right (6R)": `${C}/v1771426887/All_Right_6R_6_panels_kb4wpo.svg`,
  // 7 panels
  "7p_All Left (7L)": `${C}/v1771426881/All_Left_7L_7_panels_c0ovwr.svg`,
  "7p_All Right (7R)": `${C}/v1771426878/All_Right_7R_7_panels_zespls.svg`,
  // 8 panels
  "8p_All Left (8L)": `${C}/v1771426877/All_Left_8L_8_panels_kwqoch.svg`,
  "8p_All Right (8R)": `${C}/v1771426865/All_Right_8R_8_panels_dk2s38.svg`,
};

/* ── Lookup ─────────────────────────────────────────────── */

function getImageMap(slug: string): Record<string, string> {
  if (slug === "bi-fold") return BIFOLD_IMAGES;
  if (slug === "slide-stack") return SLIDE_STACK_IMAGES;
  return SLIDING_IMAGES; // multi-slide-pocket & ultra-slim
}

export function getLayoutImageUrl(
  slug: string,
  panelCount: number,
  layout: string,
): string | undefined {
  return getImageMap(slug)[`${panelCount}p_${layout}`];
}
