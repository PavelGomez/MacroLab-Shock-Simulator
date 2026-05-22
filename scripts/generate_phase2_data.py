#!/usr/bin/env python3
"""
Generate Phase 2 data files:
  - TRAJECTORY_DATA.json       (16 regimes × 12 quarters × 7 variables)
  - REGIME_TEMPLATE_SHEETS.json (16 sheets × 8 narrative fields)

Run from repo root:
    python3 scripts/generate_phase2_data.py
"""

import json
import math
from pathlib import Path

# ==============================================================================
# REGIME DEFINITIONS
# ==============================================================================

REGIMES = [
    # Tier 1
    {"code": "FCHR",  "name": "Floating, Coordinated, High-Credibility, Rules-based",
     "tier": 1, "exchange_rate": "Floating",  "coordination": "Coordinated",
     "credibility": "High", "fiscal": "Rules-based",   "episode_ref": "Chile 2008-2009"},
    # Tier 2
    {"code": "FCHD",  "name": "Floating, Coordinated, High-Credibility, Discretionary",
     "tier": 2, "exchange_rate": "Floating",  "coordination": "Coordinated",
     "credibility": "High", "fiscal": "Discretionary", "episode_ref": "New Zealand 2008-2009"},
    {"code": "FUHR",  "name": "Floating, Uncoordinated, High-Credibility, Rules-based",
     "tier": 2, "exchange_rate": "Floating",  "coordination": "Uncoordinated",
     "credibility": "High", "fiscal": "Rules-based",   "episode_ref": "Sweden 2008-2009"},
    {"code": "FUHD",  "name": "Floating, Uncoordinated, High-Credibility, Discretionary",
     "tier": 2, "exchange_rate": "Floating",  "coordination": "Uncoordinated",
     "credibility": "High", "fiscal": "Discretionary", "episode_ref": "Australia 2008-2009"},
    # Tier 3 – floating, low credibility
    {"code": "FCLU",  "name": "Floating, Coordinated, Low-Credibility, Unconstrained",
     "tier": 3, "exchange_rate": "Floating",  "coordination": "Coordinated",
     "credibility": "Low",  "fiscal": "Unconstrained",  "episode_ref": "Turkey 2018"},
    {"code": "FCLD",  "name": "Floating, Coordinated, Low-Credibility, Discretionary",
     "tier": 3, "exchange_rate": "Floating",  "coordination": "Coordinated",
     "credibility": "Low",  "fiscal": "Discretionary", "episode_ref": "Brazil 2015-2016"},
    {"code": "FULU",  "name": "Floating, Uncoordinated, Low-Credibility, Unconstrained",
     "tier": 3, "exchange_rate": "Floating",  "coordination": "Uncoordinated",
     "credibility": "Low",  "fiscal": "Unconstrained",  "episode_ref": "Argentina 2019"},
    {"code": "FULD",  "name": "Floating, Uncoordinated, Low-Credibility, Discretionary",
     "tier": 3, "exchange_rate": "Floating",  "coordination": "Uncoordinated",
     "credibility": "Low",  "fiscal": "Discretionary", "episode_ref": "Colombia 2022-2023"},
    # Tier 3 – pegged, high credibility
    {"code": "PFCHR", "name": "Pegged, Coordinated, High-Credibility, Rules-based",
     "tier": 3, "exchange_rate": "Pegged",    "coordination": "Coordinated",
     "credibility": "High", "fiscal": "Rules-based",   "episode_ref": "Estonia 2008-2010"},
    {"code": "PFCHD", "name": "Pegged, Coordinated, High-Credibility, Discretionary",
     "tier": 3, "exchange_rate": "Pegged",    "coordination": "Coordinated",
     "credibility": "High", "fiscal": "Discretionary", "episode_ref": "Hong Kong 2008-2009"},
    {"code": "PFUHR", "name": "Pegged, Uncoordinated, High-Credibility, Rules-based",
     "tier": 3, "exchange_rate": "Pegged",    "coordination": "Uncoordinated",
     "credibility": "High", "fiscal": "Rules-based",   "episode_ref": "Denmark 2008-2010"},
    {"code": "PFUHD", "name": "Pegged, Uncoordinated, High-Credibility, Discretionary",
     "tier": 3, "exchange_rate": "Pegged",    "coordination": "Uncoordinated",
     "credibility": "High", "fiscal": "Discretionary", "episode_ref": "Latvia 2008-2010"},
    # Tier 4 – pegged, low credibility
    {"code": "PFCLU", "name": "Pegged, Coordinated, Low-Credibility, Unconstrained",
     "tier": 4, "exchange_rate": "Pegged",    "coordination": "Coordinated",
     "credibility": "Low",  "fiscal": "Unconstrained",  "episode_ref": "Egypt 2016-2017"},
    {"code": "PFCLD", "name": "Pegged, Coordinated, Low-Credibility, Discretionary",
     "tier": 4, "exchange_rate": "Pegged",    "coordination": "Coordinated",
     "credibility": "Low",  "fiscal": "Discretionary", "episode_ref": "Tunisia 2018-2020"},
    {"code": "PFULU", "name": "Pegged, Uncoordinated, Low-Credibility, Unconstrained",
     "tier": 4, "exchange_rate": "Pegged",    "coordination": "Uncoordinated",
     "credibility": "Low",  "fiscal": "Unconstrained",  "episode_ref": "Argentina 2001-2002"},
    {"code": "PFULD", "name": "Pegged, Uncoordinated, Low-Credibility, Discretionary",
     "tier": 4, "exchange_rate": "Pegged",    "coordination": "Uncoordinated",
     "credibility": "Low",  "fiscal": "Discretionary", "episode_ref": "Venezuela 2014-2016"},
]

# ==============================================================================
# TRAJECTORY ENDPOINTS
# Q1 (post-shock, identical for all regimes) → Q12 (regime-specific)
# ==============================================================================

VARS = ["inflation", "unemployment", "real_wage",
        "policy_rate", "real_ER", "current_account", "output_gap"]

Q1 = {
    "inflation":      4.20,
    "unemployment":   2.00,
    "real_wage":     98.50,
    "policy_rate":    2.00,
    "real_ER":       95.00,
    "current_account": -0.50,
    "output_gap":    -2.00,
}

Q12 = {
    # Tier 1
    "FCHR":  {"inflation": 2.65, "unemployment": 1.20, "real_wage": 99.85,
              "policy_rate": 0.80, "real_ER": 98.50, "current_account":  0.25, "output_gap":  0.30},
    # Tier 2
    "FCHD":  {"inflation": 2.85, "unemployment": 1.45, "real_wage": 99.65,
              "policy_rate": 1.00, "real_ER": 97.50, "current_account":  0.10, "output_gap":  0.10},
    "FUHR":  {"inflation": 3.05, "unemployment": 1.65, "real_wage": 99.45,
              "policy_rate": 1.15, "real_ER": 96.50, "current_account":  0.00, "output_gap": -0.10},
    "FUHD":  {"inflation": 3.20, "unemployment": 1.85, "real_wage": 99.30,
              "policy_rate": 1.30, "real_ER": 96.00, "current_account": -0.10, "output_gap": -0.25},
    # Tier 3 – floating, low cred
    "FCLU":  {"inflation": 3.50, "unemployment": 2.25, "real_wage": 99.05,
              "policy_rate": 1.60, "real_ER": 93.00, "current_account": -0.35, "output_gap": -0.75},
    "FCLD":  {"inflation": 3.65, "unemployment": 2.45, "real_wage": 98.90,
              "policy_rate": 1.75, "real_ER": 92.50, "current_account": -0.45, "output_gap": -0.90},
    "FULU":  {"inflation": 3.75, "unemployment": 2.65, "real_wage": 98.80,
              "policy_rate": 1.85, "real_ER": 91.50, "current_account": -0.55, "output_gap": -1.05},
    "FULD":  {"inflation": 3.85, "unemployment": 2.85, "real_wage": 98.70,
              "policy_rate": 1.95, "real_ER": 91.00, "current_account": -0.65, "output_gap": -1.20},
    # Tier 3 – pegged, high cred
    "PFCHR": {"inflation": 3.45, "unemployment": 2.35, "real_wage": 98.95,
              "policy_rate": 1.70, "real_ER": 88.50, "current_account": -0.40, "output_gap": -0.95},
    "PFCHD": {"inflation": 3.60, "unemployment": 2.55, "real_wage": 98.80,
              "policy_rate": 1.85, "real_ER": 87.50, "current_account": -0.55, "output_gap": -1.10},
    "PFUHR": {"inflation": 3.70, "unemployment": 2.75, "real_wage": 98.65,
              "policy_rate": 1.95, "real_ER": 87.00, "current_account": -0.65, "output_gap": -1.25},
    "PFUHD": {"inflation": 3.80, "unemployment": 2.95, "real_wage": 98.55,
              "policy_rate": 2.05, "real_ER": 86.50, "current_account": -0.75, "output_gap": -1.40},
    # Tier 4 – pegged, low cred
    "PFCLU": {"inflation": 4.00, "unemployment": 3.45, "real_wage": 98.25,
              "policy_rate": 2.35, "real_ER": 87.00, "current_account": -1.10, "output_gap": -1.85},
    "PFCLD": {"inflation": 4.10, "unemployment": 3.75, "real_wage": 98.15,
              "policy_rate": 2.50, "real_ER": 86.50, "current_account": -1.20, "output_gap": -2.00},
    "PFULU": {"inflation": 4.20, "unemployment": 4.05, "real_wage": 98.05,
              "policy_rate": 2.65, "real_ER": 86.00, "current_account": -1.30, "output_gap": -2.15},
    "PFULD": {"inflation": 4.35, "unemployment": 4.35, "real_wage": 98.00,
              "policy_rate": 2.80, "real_ER": 85.50, "current_account": -1.40, "output_gap": -2.30},
}

# ==============================================================================
# TRAJECTORY INTERPOLATION
# ==============================================================================

def interp(start, end, quarter, tier):
    """Smooth path from Q1 → Q12 with tier-specific convergence speed."""
    t = (quarter - 1) / 11.0   # 0.0 at Q1, 1.0 at Q12
    if tier == 1:
        alpha = math.sqrt(t)          # fast early gain
    elif tier == 2:
        alpha = t                     # linear
    elif tier == 3:
        alpha = t ** 1.8              # slow start, accelerates late
    else:
        alpha = t ** 2.8              # very slow, minimal convergence
    return round(start + (end - start) * alpha, 2)


def generate_trajectories():
    rows = []
    regime_map = {r["code"]: r for r in REGIMES}
    for regime in REGIMES:
        code = regime["code"]
        tier = regime["tier"]
        end  = Q12[code]
        for q in range(1, 13):
            row = {"regime": code, "quarter": q}
            for var in VARS:
                row[var] = interp(Q1[var], end[var], q, tier)
            rows.append(row)
    return rows

# ==============================================================================
# NARRATIVE TEMPLATES
# All fields verified within character limits (measured with len()).
# ==============================================================================

NARRATIVES = {
    "FCHR": {
        "mechanism": (
            "Cost-push shock hits floating-rate economy with coordinated monetary-fiscal "
            "policy and credible inflation targeting. Floating ER depreciates moderately, "
            "absorbing external pressure. CB tightens by 50-75bp; well-anchored expectations "
            "limit wage-price spiral. Structural fiscal rule maintains automatic stabilizers "
            "without procyclical expansion. Output gap widens briefly then recovers as "
            "credibility prevents expectation de-anchoring. ER adjustment buffers real sector "
            "from full external impact."
        ),
        "feedback_loop": (
            "Anchored expectations constrain wage demands; real wages recover as inflation "
            "falls. Fiscal credibility reinforces CB signals: lower inflation → lower rate → "
            "investment recovery → output gap closure. Virtuous cycle sustained by "
            "track record."
        ),
        "policy_feasibility": (
            "Structural fiscal rule permits automatic stabilizers. CB independence "
            "well-established. Political consensus supports IT. Low public debt enables "
            "response if needed."
        ),
        "incidence": (
            "Traded sector bears initial ER depreciation burden. Coordinated wage policy "
            "limits second-round effects on formal labor markets."
        ),
        "discriminating_evidence": (
            "Inflation expectations remain 2.5-3.5% (CB surveys). Policy rate peaks below "
            "+100bp above pre-shock. Real wages recover within 2-3 quarters. CA returns to "
            "near-baseline by Q6-Q8. Output gap closes in 7-9 quarters. Bond spreads stable. "
            "Ref: Chile 2008-2009 (BCCh, DIPRES); analogues: NZ, Sweden with strong IT."
        ),
        "narrative_summary": (
            "Q1-Q2: Cost-push shock raises inflation to 4.2%; output gap widens to -2.0%. "
            "CB tightens moderately; fiscal rule holds. "
            "Q3-Q6: Floating ER absorbs external pressure; expectations anchor; real wages "
            "recover as disinflation proceeds. Policy rate declines. "
            "Q7-Q12: Output gap closes; inflation converges to 2.5-3.0%; CA stabilizes. "
            "Economy near potential with price stability restored."
        ),
        "anti_overclaim": (
            "MacroLab does not capture: (i) decades of credibility-building enabling this "
            "regime; (ii) political economy of maintaining fiscal rules under electoral "
            "pressure; (iii) terms-of-trade dynamics interacting with ER depreciation; "
            "(iv) global monetary spillovers. Trajectory illustrates institutional mechanisms "
            "under stylized cost-push shock; cannot predict timing or magnitude in real episodes."
        ),
    },

    "FCHD": {
        "mechanism": (
            "Cost-push shock hits floating-rate economy with coordinated monetary-fiscal "
            "policy and credible inflation targeting. Floating ER absorbs external pressure. "
            "CB tightens; anchored expectations limit wage-price spiral. Without a structural "
            "fiscal rule, fiscal response is discretionary: government may expand to offset "
            "demand shortfall, creating mild tension with monetary tightening. Output gap "
            "widens then recovers; institutional credibility prevents full de-anchoring."
        ),
        "feedback_loop": (
            "Anchored expectations constrain wage demands. Discretionary fiscal stimulus "
            "provides demand buffer but mildly complicates disinflation. Recovery solid but "
            "slightly slower than rules-based variant due to fiscal-monetary friction."
        ),
        "policy_feasibility": (
            "High CB credibility and fiscal coordination established. Discretionary fiscal "
            "authority retains policy space. Risk of fiscal-monetary tension if expansion "
            "is excessive."
        ),
        "incidence": (
            "Traded sector bears ER depreciation burden. Discretionary transfers partially "
            "offset household income loss from adjustment."
        ),
        "discriminating_evidence": (
            "Inflation expectations remain anchored (2.5-3.5%). Policy rate peak +25-50bp "
            "above FCHR due to fiscal-monetary friction. Real wages recover in 3-4 quarters. "
            "Fiscal deficits widen 2-3pp of GDP. Output gap closes in 8-10 quarters. "
            "Ref: New Zealand 2008-2009 (RBNZ, NZ Treasury)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock raises inflation to 4.2%; output gap widens to -2.0%. CB tightens; "
            "fiscal expands discretionarily. "
            "Q3-Q6: ER absorbs pressure; expectations remain anchored despite fiscal "
            "expansion. Disinflation proceeds. "
            "Q7-Q12: Output gap closes; inflation converges to 2.8-3.2%; fiscal consolidation "
            "begins. Recovery complete but slightly slower than rules-based variant."
        ),
        "anti_overclaim": (
            "MacroLab does not capture: (i) credibility-building enabling high-cred responses; "
            "(ii) political economy of discretionary fiscal restraint; (iii) fiscal multiplier "
            "uncertainty in open economies; (iv) risk that discretionary expansion becomes "
            "entrenched. Illustrates cost of lacking fiscal rule even with high CB credibility."
        ),
    },

    "FUHR": {
        "mechanism": (
            "Cost-push shock hits floating-rate economy with high CB credibility and fiscal "
            "rule, but without formal monetary-fiscal coordination. Floating ER absorbs "
            "external pressure. CB tightens based on mandate; fiscal automatic stabilizers "
            "activate under rule constraint. Coordination gap creates mixed signals: monetary "
            "tightening meets fiscal stabilization impulse. Output gap widens moderately; "
            "recovery proceeds as CB credibility anchors expectations despite coordination gap."
        ),
        "feedback_loop": (
            "High CB credibility anchors inflation expectations despite coordination gap. "
            "Fiscal automatic stabilizers buffer demand. Recovery delayed relative to "
            "coordinated variant; mixed policy signals slow private-sector adjustment."
        ),
        "policy_feasibility": (
            "CB independence well-established. Fiscal rule constrains discretion. No formal "
            "monetary-fiscal coordination mechanism exists in this institutional design."
        ),
        "incidence": (
            "Traded sector bears ER depreciation. Coordination gap means distributional "
            "cushioning less precise; wage adjustment slower."
        ),
        "discriminating_evidence": (
            "Inflation expectations anchored (2.5-3.5%) despite coordination gap. Policy rate "
            "peaks +25-50bp above FCHR. Real wage recovery delayed 1 quarter. Output gap "
            "closes in 9-10 quarters. Fiscal deficits within rule constraints. "
            "Ref: Sweden 2008-2009 (Riksbank, Riksdag)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock raises inflation to 4.2%; output gap widens to -2.0%. CB tightens; "
            "fiscal automatic stabilizers activate without coordination. "
            "Q3-Q6: ER absorbs pressure; expectations hold; mixed policy signals delay "
            "private adjustment. "
            "Q7-Q12: Output gap closes gradually; inflation converges to 3.0-3.2%. Recovery "
            "complete but pace slower than coordinated variant."
        ),
        "anti_overclaim": (
            "MacroLab does not capture: (i) informal central banker-finance minister "
            "communication that partially offsets formal coordination gaps; (ii) market "
            "confidence effects of policy fragmentation; (iii) political economy of "
            "institutional separation. Illustrates cost of coordination gap under floating "
            "high-cred regime; does not predict real episode outcomes."
        ),
    },

    "FUHD": {
        "mechanism": (
            "Cost-push shock hits floating-rate economy with high CB credibility but "
            "uncoordinated and discretionary fiscal policy. Floating ER absorbs external "
            "pressure. CB tightens based on mandate; fiscal authority responds discretionarily "
            "without coordination. Dual independence without coordination creates policy "
            "uncertainty. Recovery occurs as CB credibility anchors expectations; fiscal "
            "discretion provides demand buffer but with coordination costs."
        ),
        "feedback_loop": (
            "CB credibility anchors expectations despite policy fragmentation. Discretionary "
            "fiscal stimulus partly offsets demand contraction but amplifies monetary "
            "adjustment burden. Recovery moderate; uncertainty persists until policy signals "
            "converge."
        ),
        "policy_feasibility": (
            "CB independent; fiscal authority discretionary without coordination. Political "
            "pressure may amplify stimulus. Dual independence creates coordination costs."
        ),
        "incidence": (
            "Traded sector bears ER depreciation. Fiscal transfers may be poorly targeted; "
            "distributional outcomes more uncertain than coordinated regimes."
        ),
        "discriminating_evidence": (
            "Inflation expectations remain anchored (2.5-3.5%) due to CB credibility. Policy "
            "rate peaks +50-75bp above FCHR. Fiscal deficits widen 2-4pp of GDP. Real wage "
            "recovery delayed. Output gap closes in 10-11 quarters. Bond spreads mildly "
            "elevated. Ref: Australia 2008-2009 (RBA, Treasury)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock raises inflation to 4.2%; output gap -2.0%. CB tightens; fiscal "
            "expands discretionarily without coordination. "
            "Q3-Q6: ER absorbs pressure; CB credibility anchors expectations despite mixed "
            "signals; disinflation proceeds slowly. "
            "Q7-Q12: Output gap closes; inflation converges to 3.0-3.5%; fiscal gradually "
            "consolidates. Most delayed recovery among high-cred floating regimes."
        ),
        "anti_overclaim": (
            "MacroLab does not capture: (i) informal central bank-treasury communication "
            "offsetting coordination gaps; (ii) credibility costs from repeated fiscal-monetary "
            "friction; (iii) political cycles amplifying discretionary fiscal timing. "
            "Illustrates dual cost of uncoordination and fiscal discretion under high-cred "
            "floating regime."
        ),
    },

    "FCLU": {
        "mechanism": (
            "Cost-push shock hits floating-rate economy with coordinated but low-credibility "
            "monetary policy and unconstrained fiscal. Floating ER depreciates sharply as "
            "markets doubt CB commitment; depreciation amplifies inflation via strong "
            "pass-through. CB faces credibility trap: tightening deepens recession; "
            "accommodation worsens inflation. Unconstrained fiscal may compete with monetary "
            "stance. Recovery requires credibility-building over multiple quarters."
        ),
        "feedback_loop": (
            "Low credibility amplifies expectations → wage demands → inflation persistence. "
            "ER depreciation reinforces spiral. Coordinated fiscal restraint limits dominance "
            "risk. Gradual credibility recovery over 6-8 quarters."
        ),
        "policy_feasibility": (
            "Low CB credibility limits rate effectiveness. Unconstrained fiscal creates "
            "dominance risk. Coordination intent present but mechanisms weak; credibility "
            "rebuilt through sustained action."
        ),
        "incidence": (
            "Inflation acts as regressive tax on low-income households. ER depreciation "
            "raises import prices; coordinated transfers partially offset."
        ),
        "discriminating_evidence": (
            "Inflation expectations rise 1-2pp above target at mid-horizon. Real depreciation "
            "8-12% in Q1-Q2 before stabilizing. Policy rate peaks at +150bp above pre-shock; "
            "real rate may stay negative. Real wages decline 1-2% before partial recovery. "
            "Output gap partially closes by Q12. Ref: Turkey 2018 (TCMB, TurkStat)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock amplified by low credibility; inflation 4.2%+; ER depreciation "
            "adds pass-through; output gap -2.0%. "
            "Q3-Q6: CB in credibility trap; coordinated fiscal restraint reduces dominance "
            "concerns; expectations partially re-anchor. "
            "Q7-Q12: Gradual disinflation; output gap partially closes; credibility still "
            "rebuilding. Stabilizes below pre-shock potential."
        ),
        "anti_overclaim": (
            "MacroLab does not capture: (i) Barro-Gordon credibility dynamics built over "
            "time; (ii) interaction between ER depreciation and balance-sheet effects in "
            "dollarized liabilities; (iii) sudden stops turning mild credibility problems "
            "into crises. Illustrates how low credibility amplifies cost-push shock; does not "
            "model political economy of credibility-building."
        ),
    },

    "FCLD": {
        "mechanism": (
            "Cost-push shock hits floating-rate economy with coordinated but low-credibility "
            "monetary policy and discretionary fiscal. Floating ER depreciates sharply, "
            "amplifying inflation. CB tightens cautiously to avoid deepening recession; "
            "limited credibility means higher rate required to achieve same expectation effect. "
            "Coordinated discretionary fiscal partially offsets demand contraction but risks "
            "inconsistency with disinflation. Recovery slow as credibility is rebuilt."
        ),
        "feedback_loop": (
            "Low credibility sustains elevated expectations despite rate hikes. Discretionary "
            "fiscal creates fiscal-monetary tension. Coordination intent moderates worst "
            "outcomes; disinflation proceeds but at higher output cost than high-cred variants."
        ),
        "policy_feasibility": (
            "Low CB credibility requires larger rate hikes. Discretionary fiscal provides "
            "flexibility but risks inconsistency. Political pressure challenges sustained "
            "tightening."
        ),
        "incidence": (
            "Inflation hits low-income households hardest. Discretionary transfers offer "
            "partial relief but financing constrained by low credibility."
        ),
        "discriminating_evidence": (
            "Inflation expectations elevated 1.5-2pp above target for 4-6 quarters. Real "
            "depreciation 6-10%. Policy rate peaks +175bp. Fiscal deficits widen 1-3pp of "
            "GDP. Output gap closes partially by Q12. Real wages recover weakly. "
            "Ref: Brazil 2015-2016 (BCB, STN)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock raises inflation to 4.2%+; output gap widens to -2.0%; ER depreciates. "
            "Q3-Q6: Coordinated policy tightens cautiously; expectations partially stabilize; "
            "fiscal discretion provides partial buffer. "
            "Q7-Q12: Gradual disinflation continues; output gap partially closes; recovery "
            "incomplete at Q12 but trajectory improving."
        ),
        "anti_overclaim": (
            "MacroLab does not capture: (i) political economy of sustaining tightening under "
            "recession pressure; (ii) fiscal fatigue that limits discretionary space; "
            "(iii) commodity price dynamics interacting with ER. Illustrates how low "
            "credibility combined with fiscal discretion raises adjustment cost vs. "
            "rules-based alternative."
        ),
    },

    "FULU": {
        "mechanism": (
            "Cost-push shock hits floating-rate economy with uncoordinated, low-credibility "
            "monetary policy and unconstrained fiscal. Floating ER depreciates sharply; low "
            "credibility and no coordination amplify pass-through. CB and fiscal authority "
            "respond without coordination: monetary tightening may be offset by fiscal "
            "expansion. Unconstrained fiscal creates high fiscal dominance risk. Recovery "
            "requires simultaneous credibility-building and coordination, a difficult "
            "combination to achieve."
        ),
        "feedback_loop": (
            "Low credibility + no coordination → de-anchored expectations → wage-price "
            "spiral risk. Fiscal dominance may force CB accommodation. Recovery conditional "
            "on both credibility gain and coordination emerging over 8-10 quarters."
        ),
        "policy_feasibility": (
            "CB lacks credibility and coordination channel. Unconstrained fiscal creates "
            "fiscal dominance risk. Policy mix prone to inconsistency; reform requires "
            "institutional redesign."
        ),
        "incidence": (
            "Inflation and depreciation compound regressive impact. Unconstrained fiscal "
            "transfers limited by credibility and financing constraints."
        ),
        "discriminating_evidence": (
            "Inflation expectations de-anchor 2-3pp above target. Sharp real depreciation "
            "10-15%. Policy rate peaks +200bp; real rates negative. Fiscal deficits widen "
            "3-5pp of GDP. Real wages decline 2-3%. Output gap barely closes by Q12. "
            "Ref: Argentina 2019 (BCRA, INDEC)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock severely amplified; inflation 4.2%+; ER depreciates sharply; "
            "output gap -2.0%; uncoordinated policy response. "
            "Q3-Q6: No coordination mechanism; monetary and fiscal signals conflict; "
            "expectations remain elevated; real wages erode. "
            "Q7-Q12: Partial stabilization but output gap largely persists; economy "
            "settles at significantly below-potential equilibrium."
        ),
        "anti_overclaim": (
            "MacroLab does not capture: (i) sudden stops and capital account crises that "
            "can convert gradual deterioration into acute crisis; (ii) multiple equilibria "
            "where credibility collapses discontinuously; (iii) political economy of "
            "institutional reform under crisis pressure. Trajectory is illustrative lower "
            "bound, not a prediction of collapse."
        ),
    },

    "FULD": {
        "mechanism": (
            "Cost-push shock hits floating-rate economy with uncoordinated, low-credibility "
            "monetary policy and discretionary fiscal. Floating ER depreciates sharply. CB "
            "tightens without fiscal coordination; discretionary fiscal may expand independently. "
            "Low credibility means higher rates needed for given impact. Uncoordinated "
            "discretionary fiscal creates inconsistency risk. Recovery slow; fiscal-monetary "
            "tension persists throughout adjustment."
        ),
        "feedback_loop": (
            "Low credibility sustains elevated expectations; discretionary fiscal may "
            "undermine disinflation. Without coordination, policy mix prone to stop-go "
            "dynamics. Gradual stabilization occurs as political pressure eventually aligns "
            "policies."
        ),
        "policy_feasibility": (
            "CB lacks credibility; fiscal acts independently. Discretionary flexibility "
            "risks politically motivated expansions undermining disinflation. Coordination "
            "must emerge organically."
        ),
        "incidence": (
            "Inflation and depreciation compound regressive impact. Discretionary transfers "
            "poorly timed and episodic; distributional protection weak."
        ),
        "discriminating_evidence": (
            "Inflation expectations elevated 2pp+ above target for 5-7 quarters. Real "
            "depreciation 8-12%. Policy rate peaks +175bp; fiscal deficits widen 2-4pp. "
            "Real wages decline 1.5-2.5%. Output gap minimal closure by Q12. "
            "Ref: Colombia 2022-2023 (BanRep, DNP)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock amplified by low credibility; inflation 4.2%+; output gap -2.0%; "
            "ER depreciates; policies uncoordinated. "
            "Q3-Q6: CB tightens cautiously; fiscal expands discretionarily; mixed signals "
            "sustain elevated expectations and slow recovery. "
            "Q7-Q12: Partial stabilization; inflation falls but remains above target; "
            "output gap persists; recovery incomplete."
        ),
        "anti_overclaim": (
            "MacroLab does not capture: (i) political cycles amplifying fiscal expansion "
            "at worst moments; (ii) market reaction to stop-go policy history; (iii) "
            "commodity revenue volatility interacting with fiscal discretion. Illustrates "
            "compound cost of low credibility plus uncoordinated discretionary fiscal policy."
        ),
    },

    "PFCHR": {
        "mechanism": (
            "Cost-push shock hits fixed-rate economy with credible peg, high CB credibility, "
            "coordinated policy, and structural fiscal rule. Peg forecloses ER adjustment; "
            "full burden falls on internal devaluation: nominal wages and prices must adjust. "
            "CB passive (rate follows anchor currency). Coordinated fiscal rule prevents "
            "procyclical expansion. Unemployment rises as real wage adjustment occurs; "
            "recovery gradual as competitiveness is restored through nominal adjustment."
        ),
        "feedback_loop": (
            "Credible peg prevents speculative attacks; fiscal rule prevents crowding-out. "
            "Internal devaluation proceeds: wages fall → competitiveness recovers → exports "
            "improve → gradual output recovery. Process requires 8-12 quarters without ER "
            "shock absorber."
        ),
        "policy_feasibility": (
            "Peg credibility well-established (currency board or treaty). Structural fiscal "
            "rule prevents procyclical expansion. Wage flexibility determines adjustment speed."
        ),
        "incidence": (
            "Wage earners bear adjustment via nominal wage compression. Exporters benefit "
            "as competitiveness restores. Short-run impact regressive."
        ),
        "discriminating_evidence": (
            "Nominal wages decline 5-10% in Q1-Q4. Unemployment rises 3-5pp before recovery. "
            "CA deficit widens initially then narrows as competitiveness restores. Fiscal "
            "surplus maintained through rule. Output gap closes slowly over 10-12 quarters. "
            "Ref: Estonia 2008-2010 (Eesti Pank, EC)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock raises inflation (via import prices); output gap widens to -2.0%; "
            "peg holds; CB passive. "
            "Q3-Q6: Internal devaluation begins; wages compress; unemployment rises; fiscal "
            "rule prevents stimulus. "
            "Q7-Q12: Competitiveness gradually restores; output gap partially closes; "
            "inflation moderates as demand weakens. Credible peg avoids speculative crisis."
        ),
        "anti_overclaim": (
            "MacroLab does not capture: (i) social and political costs of sustained wage "
            "compression (Alesina & Drazen 1991); (ii) balance-sheet effects from ER "
            "mismatch in private sector; (iii) euro area institutional support that enabled "
            "Baltic adjustment without peg collapse. Trajectory is stylized; real episodes "
            "involve political economy tensions not modeled here."
        ),
    },

    "PFCHD": {
        "mechanism": (
            "Cost-push shock hits fixed-rate economy with credible peg, high CB credibility, "
            "coordinated policy, but discretionary fiscal response. Peg forecloses ER "
            "adjustment; burden falls on internal devaluation. CB passive; discretionary "
            "fiscal attempts to offset demand contraction. Fiscal expansion under peg "
            "creates tension: stimulus can worsen CA deficit and pressure reserves. "
            "Recovery conditional on fiscal restraint eventually prevailing."
        ),
        "feedback_loop": (
            "Credible peg prevents speculation. Discretionary fiscal slows internal "
            "devaluation by sustaining demand at cost of slower competitiveness restoration. "
            "Recovery more gradual; fiscal sustainability risk if expansion persists."
        ),
        "policy_feasibility": (
            "Peg credibility established. Discretionary fiscal may face political pressure "
            "to overshoot. Risk that expansion pressures reserves and threatens peg "
            "sustainability."
        ),
        "incidence": (
            "Wage earners face adjustment; transfers partially offset. Fiscal expansion may "
            "disproportionately benefit public-sector workers."
        ),
        "discriminating_evidence": (
            "Nominal wages decline but slower than rules-based pegged variant. Fiscal deficits "
            "widen 2-3pp of GDP. CA deficit widens before narrowing. Peg holds but reserves "
            "under mild pressure. Output gap closure delayed 1-2 quarters vs. PFCHR. "
            "Ref: Hong Kong 2008-2009 (HKMA)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock raises inflation; output gap widens; peg holds; CB passive; fiscal "
            "expands discretionarily. "
            "Q3-Q6: Internal devaluation partially offset by fiscal stimulus; competitiveness "
            "restores slowly; CA deficit widens. "
            "Q7-Q12: Fiscal restraint gradually emerges; adjustment completes; inflation "
            "moderates; peg maintained throughout."
        ),
        "anti_overclaim": (
            "MacroLab does not capture: (i) reserve dynamics and speculative attack risk "
            "from fiscal expansion under peg; (ii) how long discretionary fiscal can sustain "
            "expansion before credibility risk emerges; (iii) political economy of fiscal "
            "consolidation in recession. Illustrates trade-off between stimulus and "
            "adjustment speed under fixed rate."
        ),
    },

    "PFUHR": {
        "mechanism": (
            "Cost-push shock hits fixed-rate economy with credible peg, high CB credibility, "
            "fiscal rule, but no formal monetary-fiscal coordination. Peg forecloses ER "
            "adjustment. CB passive; fiscal rule activates automatically without coordination "
            "with monetary side (which is absent). Adjustment proceeds via internal "
            "devaluation; coordination gap means fiscal and monetary (imported) signals "
            "may conflict without mechanism to align them."
        ),
        "feedback_loop": (
            "Credible peg prevents speculation. Fiscal rule prevents expansion; internal "
            "devaluation proceeds. Coordination gap means adjustment timing is less smooth; "
            "uncertainty about policy path delays recovery."
        ),
        "policy_feasibility": (
            "Peg credibility established. Fiscal rule constrains discretion. No formal "
            "monetary-fiscal coordination (monetary policy externalized via peg). Wage "
            "flexibility key to speed."
        ),
        "incidence": (
            "Wage earners bear adjustment via nominal wage compression. Coordination gap "
            "reduces distributional precision; labor adjustment slower."
        ),
        "discriminating_evidence": (
            "Nominal wage decline similar to PFCHR but with more cross-sector dispersion. "
            "Unemployment rises 3-5pp. Fiscal deficits within rule constraints. CA deficit "
            "widens then narrows. Output gap closes in 10-12 quarters. "
            "Ref: Denmark 2008-2010 (Nationalbanken, Ministry of Finance)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock raises inflation; output gap widens; peg holds; CB passive; fiscal "
            "rule activates without coordination channel. "
            "Q3-Q6: Internal devaluation proceeds; wage compression accelerates; policy "
            "signals less aligned due to coordination gap. "
            "Q7-Q12: Competitiveness gradually restores; output gap closes slowly; inflation "
            "moderates. Recovery similar to PFCHR but with added coordination friction."
        ),
        "anti_overclaim": (
            "MacroLab does not capture: (i) euro area coordination mechanisms that partially "
            "substitute for domestic monetary policy; (ii) how coordination gaps interact with "
            "peg credibility; (iii) political economy of fiscal rule maintenance during "
            "prolonged recession. Adjustment path is stylized; real episodes involve "
            "institutional details not captured."
        ),
    },

    "PFUHD": {
        "mechanism": (
            "Cost-push shock hits fixed-rate economy with credible peg, high CB credibility, "
            "but uncoordinated and discretionary fiscal policy. Peg forecloses ER adjustment. "
            "CB passive; fiscal authority responds discretionarily without coordination. "
            "Discretionary expansion under peg risks reserve pressure; internal devaluation "
            "slowed by fiscal stimulus. Recovery requires fiscal restraint to emerge, which "
            "is politically difficult under recession."
        ),
        "feedback_loop": (
            "Credible peg holds initially. Discretionary fiscal slows internal devaluation. "
            "Uncoordinated discretion creates uncertainty. Reserve pressure from expansion "
            "may eventually challenge peg. Recovery delayed relative to coordinated variants."
        ),
        "policy_feasibility": (
            "Peg credibility established but vulnerable to sustained fiscal expansion. "
            "Discretionary without coordination creates dual risk: slowing adjustment and "
            "pressuring peg reserves."
        ),
        "incidence": (
            "Wage earners face adjustment; transfers offset partially. Reserve pressure may "
            "force abrupt consolidation, amplifying distributional impact."
        ),
        "discriminating_evidence": (
            "Fiscal deficits widen 3-4pp of GDP. Reserve levels decline modestly. Nominal "
            "wage adjustment delayed relative to PFCHR by 2-3 quarters. Unemployment peaks "
            "higher and recovers slower. Output gap barely closes by Q12. "
            "Ref: Latvia 2008-2010 (Bank of Latvia, IMF)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock raises inflation; output gap widens; peg holds; fiscal expands "
            "discretionarily without coordination. "
            "Q3-Q6: Internal devaluation slowed by stimulus; reserve pressure builds mildly; "
            "unemployment rises; adjustment delayed. "
            "Q7-Q12: Fiscal restraint gradually forced by reserve dynamics; adjustment "
            "resumes; recovery incomplete at Q12."
        ),
        "anti_overclaim": (
            "MacroLab does not capture: (i) IMF/EU conditional support that enabled some "
            "Baltic adjustments without crisis; (ii) reserve threshold dynamics that convert "
            "gradual to acute crisis; (iii) political economy of austerity reversal. "
            "Trajectory illustrates highest-risk pegged high-cred configuration; real "
            "outcomes may be worse if peg breaks."
        ),
    },

    "PFCLU": {
        "mechanism": (
            "Cost-push shock hits fixed-rate economy with questioned peg credibility, "
            "coordinated but low-credibility monetary policy, and unconstrained fiscal. "
            "Peg prevents ER adjustment while low credibility amplifies capital flow "
            "vulnerability. Risk premium rises above anchor rates. Coordinated but "
            "unconstrained fiscal accommodation worsens reserve position. Internal "
            "devaluation blocked by credibility-fiscal trap. Sustained pressure on peg."
        ),
        "feedback_loop": (
            "Low cred + peg → risk premium rise → reserve drain → forced tightening → "
            "deeper recession → fiscal pressure → further drain. Coordination moderates "
            "partially; fiscal dominance risk high. Stabilization requires external anchor."
        ),
        "policy_feasibility": (
            "Peg sustainability questioned. Unconstrained fiscal creates fiscal dominance. "
            "Coordinated intent present but capacity weak. External financing or IMF program "
            "may be required."
        ),
        "incidence": (
            "Inflation and depreciation are regressive. Unconstrained transfers large but "
            "poorly targeted; reserve drain limits sustainability."
        ),
        "discriminating_evidence": (
            "Risk premium rises 200-400bp above anchor. Reserves decline 10-20% in Q1-Q4. "
            "Domestic rates exceed anchor by 300-500bp. Real wages decline 2-4%. Output gap "
            "deepens before partial stabilization. Fiscal deficit 4-6pp of GDP. "
            "Ref: Egypt 2016-2017 (CBE, IMF Article IV)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock hits peg with low credibility; risk premium rises; reserves drain; "
            "output gap -2.0%; fiscal accommodation worsens position. "
            "Q3-Q6: Coordinated policy attempts tightening; reserves stabilize; internal "
            "devaluation begins; wages under pressure. "
            "Q7-Q12: Partial stabilization; inflation moderates slightly; output gap remains "
            "large; peg maintained but fragile."
        ),
        "anti_overclaim": (
            "MacroLab does not capture: (i) discontinuous peg collapse dynamics; (ii) IMF "
            "program conditionality that may force abrupt adjustment; (iii) parallel market "
            "ER dynamics that emerge when official peg is under pressure. Trajectory shows "
            "pegged low-cred regime under sustained stress; actual outcomes may involve "
            "devaluation not modeled."
        ),
    },

    "PFCLD": {
        "mechanism": (
            "Cost-push shock hits fixed-rate economy with questioned peg credibility, "
            "coordinated but low-credibility monetary policy, and discretionary fiscal. "
            "Peg prevents ER adjustment; low credibility raises risk premium. Discretionary "
            "fiscal attempts partial stimulus but constrained by reserve concerns. "
            "Coordinated intent moderates worst outcomes; recovery slow as both credibility "
            "and fiscal sustainability remain under pressure."
        ),
        "feedback_loop": (
            "Low credibility + peg → reserve pressure → forced tightening → recession → "
            "fiscal pressure → credibility tested. Coordinated fiscal provides temporary "
            "buffer but cannot resolve peg-credibility inconsistency alone."
        ),
        "policy_feasibility": (
            "Peg sustainability under pressure. Discretionary fiscal limited by reserve "
            "concerns. Coordination intent present but constrained by reserve preservation "
            "imperative."
        ),
        "incidence": (
            "Wage earners and import-dependent households bear largest burden. Transfers "
            "limited by reserve constraints; partial relief unsustainable."
        ),
        "discriminating_evidence": (
            "Risk premium rises 150-300bp. Reserves decline 8-15%. Domestic interest rates "
            "exceed anchor by 200-400bp. Fiscal deficits widen 3-5pp. Output gap closure "
            "minimal by Q12. Real wages decline 2-3%. Ref: Tunisia 2018-2020 (BCT, IMF)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock hits; peg credibility questioned; risk premium rises; output gap "
            "-2.0%; coordinated but limited fiscal response. "
            "Q3-Q6: Reserve drain slows under coordination; internal adjustment proceeds "
            "cautiously; recovery delayed. "
            "Q7-Q12: Partial stabilization; inflation persistent; output gap minimal closure; "
            "peg maintained under strain."
        ),
        "anti_overclaim": (
            "MacroLab does not capture: (i) IMF program dynamics that restructure fiscal "
            "constraint; (ii) social unrest costs that can break political commitment to peg; "
            "(iii) role of FDI and remittances in stabilizing reserves. Trajectory illustrates "
            "slow-burn stress scenario; does not model peg collapse risk."
        ),
    },

    "PFULU": {
        "mechanism": (
            "Cost-push shock hits fixed-rate economy with deeply questioned peg credibility, "
            "uncoordinated low-credibility monetary policy, and unconstrained fiscal. All "
            "institutional vulnerabilities compound: peg blocks ER adjustment, low credibility "
            "amplifies capital outflow, unconstrained fiscal worsens reserve dynamics, and "
            "no coordination mechanism exists. Severe reserve drain creates acute peg "
            "sustainability crisis. Internal devaluation blocked; recession deepens."
        ),
        "feedback_loop": (
            "Severe spiral: peg doubt → capital flight → reserve drain → forced tightening "
            "→ recession → fiscal hemorrhage → more doubt. Unconstrained fiscal accelerates "
            "drain. Stabilization requires regime change or external intervention."
        ),
        "policy_feasibility": (
            "Peg unsustainable without fundamental reform. Unconstrained fiscal makes "
            "reserves untenable. No coordination channel exists. Political will absent; "
            "capacity for reform limited."
        ),
        "incidence": (
            "Broad damage: inflation, unemployment, wealth erosion. Unconstrained fiscal "
            "accelerates crisis. Low-income households most exposed."
        ),
        "discriminating_evidence": (
            "Reserves decline 25-40% in Q1-Q6. Risk premium exceeds 500bp. Domestic rates "
            "spike 5-8pp above anchor. Real wages collapse 5-10%. Output gap deepens to "
            "-3pp or beyond. Fiscal deficit 5-8pp of GDP. Ref: Argentina 2001 (BCRA, INDEC)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock triggers acute capital flight; reserves drain rapidly; output gap "
            "-2.0% and worsening; no coordination; unconstrained fiscal accelerates crisis. "
            "Q3-Q6: Peg under severe speculative pressure; domestic rates spike; recession "
            "deepens; wages collapse. "
            "Q7-Q12: Model shows partial stabilization; in practice, peg would likely "
            "collapse. MacroLab trajectory underestimates actual severity."
        ),
        "anti_overclaim": (
            "MacroLab SEVERELY underestimates this regime's risks: (i) peg collapse and "
            "200%+ ER adjustment not modeled; (ii) banking crisis from ER mismatch in "
            "balance sheets; (iii) political crisis and institutional breakdown; (iv) "
            "contagion to other countries. This trajectory is a stylized lower bound; "
            "do NOT use as prediction. Real outcome: Argentina 2001 crisis."
        ),
    },

    "PFULD": {
        "mechanism": (
            "Cost-push shock hits fixed-rate economy with deeply questioned peg credibility, "
            "uncoordinated low-credibility monetary policy, and discretionary fiscal. "
            "Peg blocks ER adjustment; low credibility and no coordination amplify capital "
            "outflow. Discretionary fiscal attempts partial offset but without coordination "
            "or fiscal rule, spending is unsustainable. Reserve drain makes peg untenable. "
            "Worst institutional configuration: all four dimensions adverse."
        ),
        "feedback_loop": (
            "All loops adverse: peg → capital flight → reserve drain; low cred → elevated "
            "expectations → wage pressure; no coordination → conflicting signals; "
            "discretionary fiscal → reserve drain. Most severe spiral in this taxonomy."
        ),
        "policy_feasibility": (
            "Peg unsustainable. Discretionary fiscal exacerbates reserves without "
            "coordination. Political incentives favor short-term spending. Institutional "
            "reform politically blocked."
        ),
        "incidence": (
            "Severe distributional damage: inflation, unemployment, wealth destruction, "
            "austerity. Low-income households bear disproportionate burden."
        ),
        "discriminating_evidence": (
            "Reserves collapse >40% within 6 quarters. Inflation accelerates toward 10%+ "
            "annualized in crisis scenarios. Real wages fall 8-15%. Unemployment rises 5-8pp. "
            "Output gap exceeds -4pp at trough in historical episodes. "
            "Ref: Venezuela 2014-2016 (BCV, IMF WEO)."
        ),
        "narrative_summary": (
            "Q1-Q2: Shock triggers acute crisis: capital flight, reserve drain, output gap "
            "-2.0% and deteriorating; discretionary fiscal accelerates drain; no coordination. "
            "Q3-Q6: Peg under maximum pressure; reserves near depletion; wages collapse; "
            "recession severe. "
            "Q7-Q12: MacroLab shows partial stabilization; real episodes involve peg "
            "collapse, hyperinflation, or external bailout not captured by the model."
        ),
        "anti_overclaim": (
            "MacroLab MOST SEVERELY underestimates this regime's risks: (i) peg collapse "
            "and hyperinflation dynamics; (ii) banking system collapse from ER mismatch; "
            "(iii) political authoritarian response to crisis; (iv) international contagion. "
            "This is a purely illustrative trajectory. The worst real episodes (Venezuela "
            "2014+, Zimbabwe 2008) involve dynamics entirely outside this model's scope."
        ),
    },
}

# ==============================================================================
# CHARACTER LIMIT VERIFICATION
# ==============================================================================

CHAR_LIMITS = {
    "mechanism": 500,
    "feedback_loop": 250,
    "policy_feasibility": 200,
    "incidence": 150,
    "discriminating_evidence": 370,
    "narrative_summary": 400,
    "anti_overclaim": 450,
}

def verify_limits():
    violations = []
    for code, fields in NARRATIVES.items():
        for field, limit in CHAR_LIMITS.items():
            length = len(fields[field])
            if length > limit:
                violations.append(f"  {code}.{field}: {length}/{limit} chars (over by {length-limit})")
    return violations

# ==============================================================================
# MAIN
# ==============================================================================

def main():
    root = Path(__file__).parent.parent

    # --- Verify narrative limits before writing ---
    violations = verify_limits()
    if violations:
        print("Character limit violations detected — fixing required:")
        for v in violations:
            print(v)
        print()

    # --- TRAJECTORY_DATA.json ---
    rows = generate_trajectories()
    assert len(rows) == 192, f"Expected 192 rows, got {len(rows)}"

    traj_out = {
        "metadata": {
            "version": "2.0",
            "label": "MacroLab Phase 2 Institutional Regime Trajectories — 16 regimes × 12 quarters × 7 variables",
            "description": (
                "Stylized macroeconomic trajectories for 16 institutional regime configurations "
                "responding to an identical cost-push shock (imported inflation + terms-of-trade "
                "deterioration, Q1 impact). Variables track deviation from pre-shock baselines."
            ),
            "created": "2026-05-22",
            "shock_type": "Cost-push: imported inflation + terms-of-trade deterioration",
            "shock_quarter": 1,
            "variables": VARS,
            "regime_count": 16,
            "quarter_count": 12,
            "row_count": 192,
        },
        "data": rows,
    }

    traj_path = root / "TRAJECTORY_DATA.json"
    with open(traj_path, "w", encoding="utf-8") as f:
        json.dump(traj_out, f, indent=2, ensure_ascii=False)
    print(f"Written: {traj_path} ({len(rows)} rows)")

    # --- REGIME_TEMPLATE_SHEETS.json ---
    sheets = []
    for r in REGIMES:
        sheet = {
            "regime_code": r["code"],
            "regime_name": r["name"],
            "tier": r["tier"],
            "exchange_rate": r["exchange_rate"],
            "coordination": r["coordination"],
            "credibility": r["credibility"],
            "fiscal": r["fiscal"],
            "episode_ref": r["episode_ref"],
        }
        sheet.update(NARRATIVES[r["code"]])
        sheets.append(sheet)

    template_out = {
        "metadata": {
            "version": "2.0",
            "label": "MacroLab Phase 2 Regime Narrative Templates — 16 sheets × 8 narrative fields",
            "description": (
                "Narrative templates documenting causal mechanism, feedback dynamics, "
                "policy feasibility, distributional incidence, discriminating evidence, "
                "3-phase narrative summary, and pedagogical limits for each institutional regime."
            ),
            "created": "2026-05-22",
            "fields": list(CHAR_LIMITS.keys()),
            "char_limits": CHAR_LIMITS,
        },
        "regime_sheets": sheets,
    }

    tmpl_path = root / "REGIME_TEMPLATE_SHEETS.json"
    with open(tmpl_path, "w", encoding="utf-8") as f:
        json.dump(template_out, f, indent=2, ensure_ascii=False)
    print(f"Written: {tmpl_path} ({len(sheets)} sheets)")

    if violations:
        print(f"\n⚠️  {len(violations)} character limit violation(s) — review output above")
    else:
        print("\n✅ All character limits respected")


if __name__ == "__main__":
    main()
