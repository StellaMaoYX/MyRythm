import svgPaths from "./insights-icons-svg-paths";

function H() {
  return (
    <div className="h-[35.991px] relative shrink-0 w-full" data-name="h1">
      <p className="absolute font-['DM_Serif_Display:Regular',sans-serif] leading-[36px] left-0 not-italic text-[#2d2a26] text-[24px] top-[0.27px]">Insights</p>
    </div>
  );
}

function P() {
  return (
    <div className="h-[19.492px] relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[19.5px] left-0 text-[#8a8680] text-[13px] top-[0.27px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        Your bio-signals, visualized and synthesized
      </p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[1.999px] h-[57.483px] items-start relative shrink-0 w-full" data-name="Container">
      <H />
      <P />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white flex-[1_0_0] h-[35.484px] min-h-px min-w-px relative rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[19.5px] left-[87.7px] text-[#2d2a26] text-[13px] text-center top-[8.27px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Pattern Insights
        </p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="flex-[1_0_0] h-[35.484px] min-h-px min-w-px relative rounded-[12px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[19.5px] left-[87.68px] text-[#8a8680] text-[13px] text-center top-[8.27px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Charts
        </p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#f0ebe5] h-[43.48px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[3.998px] items-start pt-[3.998px] px-[3.998px] relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function IconComp() {
  return (
    <div className="relative shrink-0 size-[13.993px]" data-name="IconComp">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9927 13.9927">
        <g clipPath="url(#clip0_11_2020)" id="IconComp">
          <path d={svgPaths.p155f6c00} id="Vector" stroke="var(--stroke-0, #7BA7A0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16606" />
        </g>
        <defs>
          <clipPath id="clip0_11_2020">
            <rect fill="white" height="13.9927" width="13.9927" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Div() {
  return (
    <div className="bg-[rgba(123,167,160,0.09)] relative rounded-[21356900px] shrink-0 size-[31.993px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <IconComp />
      </div>
    </div>
  );
}

function Span() {
  return (
    <div className="bg-[rgba(123,167,160,0.08)] h-[19.005px] relative rounded-[21356900px] shrink-0 w-[51.098px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[15px] left-[8px] text-[#7ba7a0] text-[10px] top-[1.64px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Pattern
        </p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex h-[19.005px] items-center relative shrink-0 w-full" data-name="Container">
      <Span />
    </div>
  );
}

function P1() {
  return (
    <div className="h-[17.871px] relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[17.875px] left-0 text-[#2d2a26] text-[13px] top-[0.64px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Your HRV follows your cycle
      </p>
    </div>
  );
}

function Div1() {
  return (
    <div className="flex-[1_0_0] h-[38.875px] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.999px] items-start relative size-full">
        <Container5 />
        <P1 />
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="h-[15.992px] overflow-clip relative shrink-0 w-full" data-name="ChevronDown">
      <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.32848 5.33056">
            <path d={svgPaths.p3a7099c0} id="Vector" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33264" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Div2() {
  return (
    <div className="relative shrink-0 size-[15.992px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <ChevronDown />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[66.861px] relative shrink-0 w-full" data-name="button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.994px] items-center px-[15.992px] relative size-full">
          <Div />
          <Div1 />
          <Div2 />
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-white h-[68.134px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[0.636px] relative size-full">
          <Button2 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.636px] border-[rgba(45,42,38,0.08)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function IconComp1() {
  return (
    <div className="relative shrink-0 size-[13.993px]" data-name="IconComp">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9927 13.9927">
        <g id="IconComp">
          <path d={svgPaths.pd91fe00} id="Vector" stroke="var(--stroke-0, #A3B5D6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16606" />
        </g>
      </svg>
    </div>
  );
}

function Div3() {
  return (
    <div className="bg-[rgba(163,181,214,0.09)] relative rounded-[21356900px] shrink-0 size-[31.993px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <IconComp1 />
      </div>
    </div>
  );
}

function Span1() {
  return (
    <div className="bg-[rgba(163,181,214,0.08)] h-[19.005px] relative rounded-[21356900px] shrink-0 w-[69.337px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[15px] left-[8px] text-[#a3b5d6] text-[10px] top-[1.64px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Correlation
        </p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex h-[19.005px] items-center relative shrink-0 w-full" data-name="Container">
      <Span1 />
    </div>
  );
}

function P2() {
  return (
    <div className="h-[17.871px] relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[17.875px] left-0 text-[#2d2a26] text-[13px] top-[0.64px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Sleep quality predicts next-day energy
      </p>
    </div>
  );
}

function Div4() {
  return (
    <div className="flex-[1_0_0] h-[38.875px] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.999px] items-start relative size-full">
        <Container7 />
        <P2 />
      </div>
    </div>
  );
}

function ChevronDown1() {
  return (
    <div className="h-[15.992px] overflow-clip relative shrink-0 w-full" data-name="ChevronDown">
      <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.32848 5.33056">
            <path d={svgPaths.p3a7099c0} id="Vector" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33264" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Div5() {
  return (
    <div className="relative shrink-0 size-[15.992px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <ChevronDown1 />
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[66.861px] relative shrink-0 w-full" data-name="button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.994px] items-center px-[15.992px] relative size-full">
          <Div3 />
          <Div4 />
          <Div5 />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-white h-[68.134px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[0.636px] relative size-full">
          <Button3 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.636px] border-[rgba(45,42,38,0.08)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function IconComp2() {
  return (
    <div className="relative shrink-0 size-[13.993px]" data-name="IconComp">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9927 13.9927">
        <g clipPath="url(#clip0_11_2050)" id="IconComp">
          <path d={svgPaths.p1ef6c00} id="Vector" stroke="var(--stroke-0, #D4A7B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16606" />
        </g>
        <defs>
          <clipPath id="clip0_11_2050">
            <rect fill="white" height="13.9927" width="13.9927" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Div6() {
  return (
    <div className="bg-[rgba(212,167,185,0.09)] relative rounded-[21356900px] shrink-0 size-[31.993px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <IconComp2 />
      </div>
    </div>
  );
}

function Span2() {
  return (
    <div className="bg-[rgba(212,167,185,0.08)] h-[19.005px] relative rounded-[21356900px] shrink-0 w-[64.782px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[15px] left-[8px] text-[#d4a7b9] text-[10px] top-[1.64px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Prediction
        </p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex h-[19.005px] items-center relative shrink-0 w-full" data-name="Container">
      <Span2 />
    </div>
  );
}

function P3() {
  return (
    <div className="h-[35.743px] relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[17.875px] left-0 text-[#2d2a26] text-[13px] top-[0.64px] w-[239px] whitespace-pre-wrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Temperature rise precedes period by 3 days
      </p>
    </div>
  );
}

function Div7() {
  return (
    <div className="flex-[1_0_0] h-[56.747px] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.999px] items-start relative size-full">
        <Container9 />
        <P3 />
      </div>
    </div>
  );
}

function ChevronDown2() {
  return (
    <div className="h-[15.992px] overflow-clip relative shrink-0 w-full" data-name="ChevronDown">
      <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.32848 5.33056">
            <path d={svgPaths.p3a7099c0} id="Vector" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33264" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="relative shrink-0 size-[15.992px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <ChevronDown2 />
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="h-[84.732px] relative shrink-0 w-full" data-name="button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.994px] items-center px-[15.992px] relative size-full">
          <Div6 />
          <Div7 />
          <Div8 />
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-white h-[86.005px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[0.636px] pt-[0.637px] px-[0.636px] relative size-full">
          <Button4 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.636px] border-[rgba(45,42,38,0.08)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function IconComp3() {
  return (
    <div className="relative shrink-0 size-[13.993px]" data-name="IconComp">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9927 13.9927">
        <g clipPath="url(#clip0_11_2023)" id="IconComp">
          <path d={svgPaths.p3b973880} id="Vector" stroke="var(--stroke-0, #C97B6B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16606" />
        </g>
        <defs>
          <clipPath id="clip0_11_2023">
            <rect fill="white" height="13.9927" width="13.9927" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Div9() {
  return (
    <div className="bg-[rgba(201,123,107,0.09)] relative rounded-[21356900px] shrink-0 size-[31.993px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <IconComp3 />
      </div>
    </div>
  );
}

function Span3() {
  return (
    <div className="bg-[rgba(201,123,107,0.08)] h-[19.005px] relative rounded-[21356900px] shrink-0 w-[69.337px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[15px] left-[8px] text-[#c97b6b] text-[10px] top-[1.64px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Correlation
        </p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex h-[19.005px] items-center relative shrink-0 w-full" data-name="Container">
      <Span3 />
    </div>
  );
}

function P4() {
  return (
    <div className="h-[17.871px] relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[17.875px] left-0 text-[#2d2a26] text-[13px] top-[0.64px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Movement supports your mood
      </p>
    </div>
  );
}

function Div10() {
  return (
    <div className="flex-[1_0_0] h-[38.875px] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.999px] items-start relative size-full">
        <Container11 />
        <P4 />
      </div>
    </div>
  );
}

function ChevronDown3() {
  return (
    <div className="h-[15.992px] overflow-clip relative shrink-0 w-full" data-name="ChevronDown">
      <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.32848 5.33056">
            <path d={svgPaths.p3a7099c0} id="Vector" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33264" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Div11() {
  return (
    <div className="relative shrink-0 size-[15.992px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <ChevronDown3 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="h-[66.861px] relative shrink-0 w-full" data-name="button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.994px] items-center px-[15.992px] relative size-full">
          <Div9 />
          <Div10 />
          <Div11 />
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-white h-[68.134px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[0.636px] pt-[0.637px] px-[0.636px] relative size-full">
          <Button5 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.636px] border-[rgba(45,42,38,0.08)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function MotionDiv() {
  return (
    <div className="content-stretch flex flex-col gap-[9.995px] h-[320.39px] items-start relative shrink-0 w-full" data-name="motion.div">
      <Container4 />
      <Container6 />
      <Container8 />
      <Container10 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[509.347px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[20px] items-start pt-[23.997px] px-[15.992px] relative size-full">
        <Container2 />
        <Container3 />
        <MotionDiv />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[393.348px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9995 19.9995">
        <g id="Icon">
          <path d={svgPaths.p2bcb4f30} id="Vector" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66663" />
          <path d={svgPaths.p38e43500} id="Vector_2" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66663" />
        </g>
      </svg>
    </div>
  );
}

function Span4() {
  return (
    <div className="h-[15.007px] relative shrink-0 w-[27.737px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[15px] left-[14px] text-[#8a8680] text-[10px] text-center top-[-0.36px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Home
        </p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="h-[56.995px] relative shrink-0 w-[51.724px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.999px] items-center py-[9.995px] relative size-full">
        <Icon />
        <Span4 />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9995 19.9995">
        <g clipPath="url(#clip0_11_2031)" id="Icon">
          <path d={svgPaths.p12e63100} id="Vector" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66663" />
        </g>
        <defs>
          <clipPath id="clip0_11_2031">
            <rect fill="white" height="19.9995" width="19.9995" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Span5() {
  return (
    <div className="h-[15.007px] relative shrink-0 w-[22.824px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[15px] left-[11.5px] text-[#8a8680] text-[10px] text-center top-[-0.36px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Chat
        </p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="h-[56.995px] relative shrink-0 w-[46.811px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.999px] items-center py-[9.995px] relative size-full">
        <Icon1 />
        <Span5 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9995 19.9995">
        <g clipPath="url(#clip0_11_2026)" id="Icon">
          <path d={svgPaths.p300b0f00} id="Vector" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66663" />
          <path d={svgPaths.p33ac0000} id="Vector_2" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66663" />
          <path d={svgPaths.p5ca3400} id="Vector_3" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66663" />
        </g>
        <defs>
          <clipPath id="clip0_11_2026">
            <rect fill="white" height="19.9995" width="19.9995" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Span6() {
  return (
    <div className="h-[15.007px] relative shrink-0 w-[41.073px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[15px] left-[21px] text-[#8a8680] text-[10px] text-center top-[-0.36px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Check In
        </p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="h-[56.995px] relative shrink-0 w-[65.061px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.999px] items-center py-[9.995px] relative size-full">
        <Icon2 />
        <Span6 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9995 19.9995">
        <g id="Icon">
          <path d={svgPaths.p14af8a0} id="Vector" stroke="var(--stroke-0, #8B6E5A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66663" />
          <path d="M14.9997 14.1663V7.49983" id="Vector_2" stroke="var(--stroke-0, #8B6E5A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66663" />
          <path d="M10.8331 14.1663V4.16657" id="Vector_3" stroke="var(--stroke-0, #8B6E5A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66663" />
          <path d="M6.66651 14.1663V11.6664" id="Vector_4" stroke="var(--stroke-0, #8B6E5A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66663" />
        </g>
      </svg>
    </div>
  );
}

function Span7() {
  return (
    <div className="h-[15.007px] relative shrink-0 w-[37.214px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[15px] left-[19px] text-[#8b6e5a] text-[10px] text-center top-[-0.36px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Insights
        </p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="h-[56.995px] relative shrink-0 w-[61.202px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.999px] items-center py-[9.995px] relative size-full">
        <Icon3 />
        <Span7 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9995 19.9995">
        <g id="Icon">
          <path d={svgPaths.p3641e900} id="Vector" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66663" />
          <path d={svgPaths.p3dceb680} id="Vector_2" stroke="var(--stroke-0, #8A8680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66663" />
        </g>
      </svg>
    </div>
  );
}

function Span8() {
  return (
    <div className="h-[15.007px] relative shrink-0 w-[29.686px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['DM_Sans:Medium',sans-serif] font-medium leading-[15px] left-[15px] text-[#8a8680] text-[10px] text-center top-[-0.36px]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Profile
        </p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="h-[56.995px] relative shrink-0 w-[53.674px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.999px] items-center py-[9.995px] relative size-full">
        <Icon4 />
        <Span8 />
      </div>
    </div>
  );
}

function Div12() {
  return (
    <div className="h-[56.995px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[9.885px] pr-[9.915px] relative size-full">
          <Button6 />
          <Button7 />
          <Button8 />
          <Button9 />
          <Button10 />
        </div>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="bg-white h-[57.632px] relative shrink-0 w-[393.348px]" data-name="nav">
      <div aria-hidden="true" className="absolute border-[rgba(45,42,38,0.08)] border-solid border-t-[0.636px] inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[0.637px] px-[7.996px] relative size-full">
        <Div12 />
      </div>
    </div>
  );
}

export default function TeresaPersonalRhythmBaselineApp() {
  return (
    <div className="bg-[#faf8f5] content-stretch flex flex-col items-start relative size-full" data-name="[Teresa] Personal Rhythm Baseline App">
      <Container />
      <Nav />
    </div>
  );
}