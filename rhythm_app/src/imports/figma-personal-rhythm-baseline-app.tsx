import svgPaths from "./home-icons-svg-paths";

function P() {
  return (
    <div className="h-[19.491px] relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[19.5px] left-0 text-[#8a8680] text-[13px] top-[0.05px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        Sunday, March 1
      </p>
    </div>
  );
}

function H() {
  return (
    <div className="h-[36.001px] relative shrink-0 w-full" data-name="h1">
      <p className="absolute font-['DM_Serif_Display:Regular',sans-serif] leading-[36px] left-0 not-italic text-[#2d2a26] text-[24px] top-[0.57px]">Good morning, Aria</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[55.491px] items-start left-0 top-0 w-[210.746px]" data-name="Container">
      <P />
      <H />
    </div>
  );
}

function Bell() {
  return (
    <div className="absolute left-[9.48px] size-[19.999px] top-[9.48px]" data-name="Bell">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9986 19.9986">
        <g clipPath="url(#clip0_8_1660)" id="Bell">
          <path d={svgPaths.p13035b80} id="Vector" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66655" />
          <path d={svgPaths.p660c780} id="Vector_2" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66655" />
        </g>
        <defs>
          <clipPath id="clip0_8_1660">
            <rect fill="white" height="19.9986" width="19.9986" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Span() {
  return <div className="absolute bg-[#c97b6b] left-[24.96px] rounded-[17586600px] size-[7.993px] top-[5.99px]" data-name="span" />;
}

function Button() {
  return (
    <div className="absolute bg-white border-[0.524px] border-[rgba(45,42,38,0.08)] border-solid left-[321.11px] rounded-[17586600px] size-[39.997px] top-[7.75px]" data-name="button">
      <Bell />
      <Span />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[55.491px] relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Button />
    </div>
  );
}

function H2() {
  return (
    <div className="h-[27.001px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[27px] left-0 text-[#2d2a26] text-[18px] top-[-0.43px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Daily Insights
      </p>
    </div>
  );
}

function Container6() {
  return <div className="bg-[#a67c37] rounded-[17586600px] shrink-0 size-[7.993px]" data-name="Container" />;
}

function Container5() {
  return (
    <div className="bg-[rgba(255,224,178,0.6)] relative rounded-[17586600px] shrink-0 size-[19.999px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container6 />
      </div>
    </div>
  );
}

function Span1() {
  return (
    <div className="h-[17.992px] relative shrink-0 w-[53.944px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[18px] left-0 text-[#a67c37] text-[12px] top-[0.05px] tracking-[0.3px] uppercase" style={{ fontVariationSettings: "'opsz' 9" }}>
          Drifting
        </p>
      </div>
    </div>
  );
}

function Div() {
  return (
    <div className="h-[19.999px] relative shrink-0 w-[335.783px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.993px] items-center relative size-full">
        <Container5 />
        <Span1 />
      </div>
    </div>
  );
}

function H1() {
  return (
    <div className="h-[29px] relative shrink-0 w-[335px]" data-name="h2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Bold',sans-serif] font-bold leading-[27px] left-[0.49px] text-[#2d2a26] text-[17px] top-[0.52px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Your recovery load is higher than usual
        </p>
      </div>
    </div>
  );
}

function P1() {
  return (
    <div className="h-[42.225px] relative shrink-0 w-[335.783px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[21.125px] left-0 text-[#3a3a3a] text-[13px] top-[-0.43px] w-[330px] whitespace-pre-wrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          Two signals are running below your baseline. Your body is asking for less, not more.
        </p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative shrink-0 w-full" data-name="button">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[11.997px] items-start justify-center pl-[13.996px] relative w-full">
          <Div />
          <H1 />
          <P1 />
        </div>
      </div>
    </div>
  );
}

function Span2() {
  return (
    <div className="h-[16.493px] relative shrink-0 w-[3.079px]" data-name="span">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[16.5px] left-0 text-[#353535] text-[11px] top-[-0.48px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        ›
      </p>
    </div>
  );
}

function Span3() {
  return (
    <div className="h-[17.992px] relative shrink-0 w-[176.859px]" data-name="span">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[18px] left-0 text-[#363636] text-[12px] top-[0.05px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        Luteal phase, day 4 · factored in
      </p>
    </div>
  );
}

function Div1() {
  return (
    <div className="bg-[rgba(255,255,255,0.7)] content-stretch flex gap-[6px] items-center px-[12px] py-[6px] relative rounded-[17586600px] shrink-0" data-name="div">
      <Span2 />
      <Span3 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start px-[12px] relative shrink-0">
      <Div1 />
    </div>
  );
}

function MotionDiv() {
  return (
    <div className="bg-[#fdf8e7] relative rounded-[16px] shrink-0 w-full" data-name="motion.div">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start px-[0.524px] py-[16px] relative w-full">
          <Button1 />
          <Frame />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(45,42,38,0.08)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <H2 />
      <MotionDiv />
    </div>
  );
}

function P2() {
  return (
    <div className="h-[16.493px] relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] left-[-0.01px] text-[#1e1e1e] text-[11px] top-[-0.79px] tracking-[0.275px] uppercase" style={{ fontVariationSettings: "'opsz' 14" }}>{`What's Contributing`}</p>
    </div>
  );
}

function Span4() {
  return <div className="bg-[#c97b6b] rounded-[17586600px] shrink-0 size-[9.999px]" data-name="span" />;
}

function Span5() {
  return (
    <div className="flex-[1_0_0] h-[21.006px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[21px] left-[-0.01px] text-[#2d2a26] text-[14px] top-[0.26px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Sleep quality
        </p>
      </div>
    </div>
  );
}

function Span6() {
  return (
    <div className="bg-[#fff3e0] h-[25.535px] relative rounded-[17586600px] shrink-0 w-[114.619px]" data-name="span">
      <div aria-hidden="true" className="absolute border-[#ffe0b2] border-[0.524px] border-solid inset-0 pointer-events-none rounded-[17586600px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] left-[10.52px] text-[#a67c37] text-[11px] top-[3.73px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Lighter than usual
        </p>
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[15.994px]" data-name="ChevronDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9939 15.9939">
        <g id="ChevronDown">
          <path d={svgPaths.pdb996c0} id="Vector" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33283" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex gap-[11.998px] h-[53.526px] items-center pb-[0.524px] relative shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border-[#d4d4d4] border-b-[0.524px] border-solid inset-0 pointer-events-none" />
      <Span4 />
      <Span5 />
      <Span6 />
      <ChevronDown />
    </div>
  );
}

function Span7() {
  return <div className="bg-[#c4453e] rounded-[17586600px] shrink-0 size-[9.999px]" data-name="span" />;
}

function Span8() {
  return (
    <div className="flex-[1_0_0] h-[21.006px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[21px] left-[-0.01px] text-[#2d2a26] text-[14px] top-[0.26px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          HRV
        </p>
      </div>
    </div>
  );
}

function Span9() {
  return (
    <div className="bg-[#fbe9e7] h-[25.535px] relative rounded-[17586600px] shrink-0 w-[97.806px]" data-name="span">
      <div aria-hidden="true" className="absolute border-[#ffccbc] border-[0.524px] border-solid inset-0 pointer-events-none rounded-[17586600px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] left-[10.52px] text-[#c4453e] text-[11px] top-[3.73px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Trending down
        </p>
      </div>
    </div>
  );
}

function ChevronDown1() {
  return (
    <div className="relative shrink-0 size-[15.994px]" data-name="ChevronDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9939 15.9939">
        <g id="ChevronDown">
          <path d={svgPaths.pdb996c0} id="Vector" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33283" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex gap-[11.998px] h-[53.526px] items-center pb-[0.524px] relative shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border-[#d4d4d4] border-b-[0.524px] border-solid inset-0 pointer-events-none" />
      <Span7 />
      <Span8 />
      <Span9 />
      <ChevronDown1 />
    </div>
  );
}

function Span10() {
  return <div className="bg-[#8a8680] rounded-[17586600px] shrink-0 size-[9.999px]" data-name="span" />;
}

function Span11() {
  return (
    <div className="flex-[1_0_0] h-[21.006px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[21px] left-[-0.01px] text-[#2d2a26] text-[14px] top-[0.26px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Resting heart rate
        </p>
      </div>
    </div>
  );
}

function Span12() {
  return (
    <div className="bg-[#f0ebe5] h-[25.535px] relative rounded-[17586600px] shrink-0 w-[87.332px]" data-name="span">
      <div aria-hidden="true" className="absolute border-[#e8dfd5] border-[0.524px] border-solid inset-0 pointer-events-none rounded-[17586600px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] left-[10.52px] text-[#8a8680] text-[11px] top-[3.73px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Within range
        </p>
      </div>
    </div>
  );
}

function ChevronDown2() {
  return (
    <div className="relative shrink-0 size-[15.994px]" data-name="ChevronDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9939 15.9939">
        <g id="ChevronDown">
          <path d={svgPaths.pdb996c0} id="Vector" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33283" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex gap-[11.998px] h-[53.526px] items-center pb-[0.524px] relative shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border-[#d4d4d4] border-b-[0.524px] border-solid inset-0 pointer-events-none" />
      <Span10 />
      <Span11 />
      <Span12 />
      <ChevronDown2 />
    </div>
  );
}

function Span13() {
  return <div className="bg-[#4a7c59] rounded-[17586600px] shrink-0 size-[9.999px]" data-name="span" />;
}

function Span14() {
  return (
    <div className="flex-[1_0_0] h-[21.006px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[21px] left-[-0.01px] text-[#2d2a26] text-[14px] top-[0.26px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Active energy
        </p>
      </div>
    </div>
  );
}

function Span15() {
  return (
    <div className="bg-[#e8f5e9] h-[25.535px] relative rounded-[17586600px] shrink-0 w-[66.072px]" data-name="span">
      <div aria-hidden="true" className="absolute border-[#c8e6c9] border-[0.524px] border-solid inset-0 pointer-events-none rounded-[17586600px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] left-[10.52px] text-[#4a7c59] text-[11px] top-[3.73px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          On track
        </p>
      </div>
    </div>
  );
}

function ChevronDown3() {
  return (
    <div className="relative shrink-0 size-[15.994px]" data-name="ChevronDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9939 15.9939">
        <g id="ChevronDown">
          <path d={svgPaths.p24333700} id="Vector" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33283" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex gap-[11.998px] h-[53.526px] items-center relative shrink-0 w-full" data-name="button">
      <Span13 />
      <Span14 />
      <Span15 />
      <ChevronDown3 />
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-white h-[216.725px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(45,42,38,0.08)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[0.524px] items-start px-[16.518px] py-[0.524px] relative size-full">
        <Button2 />
        <Button3 />
        <Button4 />
        <Button5 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[7.993px] h-[241px] items-start relative shrink-0 w-[361px]" data-name="Container">
      <P2 />
      <Container8 />
    </div>
  );
}

function P3() {
  return (
    <div className="h-[16.493px] relative shrink-0 w-[71.076px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] left-0 text-[#1e1e1e] text-[11px] top-[-0.48px] tracking-[0.275px] uppercase" style={{ fontVariationSettings: "'opsz' 14" }}>
          Week Ahead
        </p>
      </div>
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="absolute left-[46px] size-[13.996px] top-[2px]" data-name="ChevronRight">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9957 13.9957">
        <g id="ChevronRight">
          <path d={svgPaths.p23aebf00} id="Vector" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16631" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="h-[17.992px] relative shrink-0 w-[52.486px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] left-0 text-[#1e1e1e] text-[11px] top-[0.05px] tracking-[0.275px] uppercase" style={{ fontVariationSettings: "'opsz' 14" }}>{`See all `}</p>
        <ChevronRight />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex h-[17.992px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <P3 />
      <Button6 />
    </div>
  );
}

function P4() {
  return (
    <div className="absolute h-[33px] left-[0.49px] top-[-0.2px] w-[68px]" data-name="p">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[16.25px] left-0 text-[#2d2a26] text-[13px] top-[-0.52px] w-[56px] whitespace-pre-wrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        Recovery window
      </p>
    </div>
  );
}

function Span16() {
  return (
    <div className="absolute bg-[#f0ebe5] h-[22px] left-[91.49px] rounded-[4px] top-[-0.2px] w-[58px]" data-name="span">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[16.5px] left-[7px] text-[#292929] text-[11px] top-[3px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        Mar 3–5
      </p>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[36.983px] left-[16.52px] top-[16.52px] w-[149.383px]" data-name="Container">
      <P4 />
      <Span16 />
    </div>
  );
}

function P5() {
  return (
    <div className="absolute h-[41.995px] left-[16.52px] top-[65.5px] w-[149.383px]" data-name="p">
      <p className="absolute font-['DM_Serif_Display:Regular',sans-serif] leading-[42px] left-0 not-italic text-[#565656] text-[28px] top-[-0.43px]">62%</p>
    </div>
  );
}

function P6() {
  return (
    <div className="absolute h-[16.493px] left-[16.52px] top-[109.49px] w-[149.383px]" data-name="p">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[16.5px] left-0 text-[#8a8680] text-[11px] top-[-0.48px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        capacity predicted
      </p>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-white flex-[1_0_0] h-[142.504px] min-h-px min-w-px relative rounded-[16px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(45,42,38,0.08)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container13 />
        <P5 />
        <P6 />
      </div>
    </div>
  );
}

function P7() {
  return (
    <div className="h-[16.24px] relative shrink-0 w-[80.412px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[16.25px] left-0 text-[#2d2a26] text-[13px] top-[-0.52px]" style={{ fontVariationSettings: "'opsz' 9" }}>
          Focus quality
        </p>
      </div>
    </div>
  );
}

function Span17() {
  return (
    <div className="bg-[#f0ebe5] h-[20.49px] relative rounded-[4px] shrink-0 w-[59.185px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[16.5px] left-[7.99px] text-[#403f3f] text-[11px] top-[1.52px]" style={{ fontVariationSettings: "'opsz' 9" }}>
          Mar 6–8
        </p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex h-[20.49px] items-start justify-between left-[16.52px] top-[16.52px] w-[149.383px]" data-name="Container">
      <P7 />
      <Span17 />
    </div>
  );
}

function P8() {
  return (
    <div className="absolute h-[41.995px] left-[16.5px] top-[64.32px] w-[149.383px]" data-name="p">
      <p className="absolute font-['DM_Serif_Display:Regular',sans-serif] leading-[42px] left-0 not-italic text-[#4a7c59] text-[28px] top-[-0.43px]">84%</p>
    </div>
  );
}

function P9() {
  return (
    <div className="absolute h-[16.493px] left-[16.5px] top-[108.31px] w-[149.383px]" data-name="p">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[16.5px] left-0 text-[#8a8680] text-[11px] top-[-0.48px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        your follicular baseline
      </p>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-white flex-[1_0_0] h-[142.504px] min-h-px min-w-px relative rounded-[16px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(45,42,38,0.08)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container15 />
        <P8 />
        <P9 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[11.997px] h-[142.504px] items-start pr-[-0.008px] relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <Container14 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col gap-[11.997px] h-[172.494px] items-start relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <Frame1 />
      <Container7 />
      <Container9 />
    </div>
  );
}

function Span18() {
  return (
    <div className="absolute h-[16.493px] left-[20.52px] top-[20.7px] w-[335.783px]" data-name="span">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[16.5px] left-0 text-[#c97b6b] text-[11px] top-[-0.48px] tracking-[0.275px] uppercase" style={{ fontVariationSettings: "'opsz' 9" }}>{`Today's Suggestion`}</p>
    </div>
  );
}

function P10() {
  return (
    <div className="absolute h-[73.14px] left-[20.52px] top-[45.19px] w-[335.783px]" data-name="p">
      <p className="absolute font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[21.125px] left-0 text-[#3a3a3a] text-[13px] top-[0.57px] w-[320px] whitespace-pre-wrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Consider moving your high-intensity workout to tomorrow — your recovery signal is lower than your usual Sunday.
      </p>
    </div>
  );
}

function Span19() {
  return (
    <div className="h-[17.992px] relative shrink-0 w-[167.359px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[18px] left-[-0.49px] text-[#8a8680] text-[12px] top-[-0.44px]" style={{ fontVariationSettings: "'opsz' 9" }}>
          Based on HRV + sleep + phase
        </p>
      </div>
    </div>
  );
}

function ThumbsUp() {
  return (
    <div className="relative shrink-0 size-[15.994px]" data-name="ThumbsUp">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9939 15.9939">
        <g id="ThumbsUp">
          <path d="M4.17554 6.17255V14.1695" id="Vector" stroke="var(--stroke-0, #2D2A26)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33283" />
          <path d={svgPaths.p19932b80} id="Vector_2" stroke="var(--stroke-0, #2D2A26)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33283" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] relative rounded-[17586600px] shrink-0 size-[31.996px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <ThumbsUp />
      </div>
    </div>
  );
}

function ThumbsDown() {
  return (
    <div className="relative shrink-0 size-[15.994px]" data-name="ThumbsDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9939 15.9939">
        <g id="ThumbsDown">
          <path d="M10.8397 8.83821V0.841248" id="Vector" stroke="var(--stroke-0, #2D2A26)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33283" />
          <path d={svgPaths.p2697de00} id="Vector_2" stroke="var(--stroke-0, #2D2A26)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33283" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] relative rounded-[17586600px] shrink-0 size-[31.996px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <ThumbsDown />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[31.996px] relative shrink-0 w-[71.985px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.993px] items-center relative size-full">
        <Button7 />
        <Button8 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-center justify-between left-[21.01px] top-[130.82px] w-[320px]" data-name="Container">
      <Span19 />
      <Container18 />
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-[rgba(201,123,107,0.12)] h-[183px] relative rounded-[16px] shrink-0 w-[360px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.524px] border-[rgba(201,123,107,0.2)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Span18 />
      <P10 />
      <Container17 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[1092.059px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[23.995px] items-start pt-[23.995px] px-[15.994px] relative size-full">
        <Container2 />
        <Container4 />
        <Container16 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[1152px] relative shrink-0 w-[393px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container1 />
      </div>
    </div>
  );
}

export default function PersonalRhythmBaselineApp() {
  return (
    <div className="bg-[#faf8f5] content-stretch flex flex-col items-start relative size-full" data-name="Personal Rhythm Baseline App">
      <Container />
    </div>
  );
}