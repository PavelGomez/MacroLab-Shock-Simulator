#!/usr/bin/env python3
"""
MacroLab Phase 2: Backend Data Preparation & Validation
========================================================

Purpose:
Validate trajectory data and regime templates; prepare backend schemas.

Input files:
- TRAJECTORY_DATA.json (16 regimes × 12 quarters × 7 variables)
- REGIME_TEMPLATE_SHEETS.json (16 sheets × 8 fields)

Output:
- Data validation report (quality checks, ranges, consistency)
- Backend schema suggestions (SQL, API, indexes)
- Index structures for regime search/filtering
"""

import json
import csv
from pathlib import Path
from typing import Dict, List, Tuple
from collections import defaultdict
import statistics

# ==============================================================================
# LOAD DATA
# ==============================================================================

def load_trajectory_data(filepath: str) -> Tuple[Dict, List[Dict]]:
    """Load trajectory data from JSON."""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data['metadata'], data['data']

def load_template_sheets(filepath: str) -> Tuple[Dict, List[Dict]]:
    """Load regime template sheets from JSON."""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data['metadata'], data['regime_sheets']

# ==============================================================================
# TRAJECTORY DATA VALIDATION
# ==============================================================================

def validate_trajectory_data(metadata: Dict, data: List[Dict]) -> Dict:
    """
    Perform comprehensive validation on trajectory data.

    Returns: Dictionary with validation results
    """

    report = {
        "total_rows": len(data),
        "expected_rows": 192,  # 16 regimes × 12 quarters
        "regimes": set(),
        "quarters": set(),
        "variables": {
            "inflation": {"min": None, "max": None, "mean": None, "std": None, "nulls": 0},
            "unemployment": {"min": None, "max": None, "mean": None, "std": None, "nulls": 0},
            "real_wage": {"min": None, "max": None, "mean": None, "std": None, "nulls": 0},
            "policy_rate": {"min": None, "max": None, "mean": None, "std": None, "nulls": 0},
            "real_ER": {"min": None, "max": None, "mean": None, "std": None, "nulls": 0},
            "current_account": {"min": None, "max": None, "mean": None, "std": None, "nulls": 0},
            "output_gap": {"min": None, "max": None, "mean": None, "std": None, "nulls": 0},
        },
        "issues": [],
        "regime_convergence": {},
    }

    # Extract variable values
    var_values = {var: [] for var in report["variables"].keys()}
    regime_data = defaultdict(list)

    for row in data:
        regime = row.get("regime")
        quarter = row.get("quarter")

        if regime:
            report["regimes"].add(regime)
        if quarter:
            report["quarters"].add(quarter)

        # Track values per regime
        if regime:
            regime_data[regime].append(row)

        # Collect values for statistics
        for var in var_values.keys():
            val = row.get(var)
            if val is not None:
                var_values[var].append(val)
            else:
                report["variables"][var]["nulls"] += 1

    # Compute statistics per variable
    for var, values in var_values.items():
        if values:
            report["variables"][var]["min"] = round(min(values), 4)
            report["variables"][var]["max"] = round(max(values), 4)
            report["variables"][var]["mean"] = round(statistics.mean(values), 4)
            report["variables"][var]["std"] = round(statistics.stdev(values), 4) if len(values) > 1 else 0

    # Check completeness
    if len(data) != report["expected_rows"]:
        report["issues"].append(f"Data incomplete: {len(data)} rows instead of {report['expected_rows']}")

    if len(report["regimes"]) != 16:
        report["issues"].append(f"Expected 16 regimes, found {len(report['regimes'])}")

    if len(report["quarters"]) != 12:
        report["issues"].append(f"Expected 12 quarters, found {len(report['quarters'])}")

    # Check for missing null values where shouldn't be
    for var in report["variables"]:
        if report["variables"][var]["nulls"] > 0:
            report["issues"].append(f"Variable '{var}' has {report['variables'][var]['nulls']} null values")

    # Analyze regime convergence patterns
    for regime, rows in regime_data.items():
        sorted_rows = sorted(rows, key=lambda x: x.get("quarter", 0))
        if len(sorted_rows) >= 2:
            first_inflation = sorted_rows[0].get("inflation")
            last_inflation = sorted_rows[-1].get("inflation")
            first_output_gap = sorted_rows[0].get("output_gap")
            last_output_gap = sorted_rows[-1].get("output_gap")

            report["regime_convergence"][regime] = {
                "inflation_initial": round(first_inflation, 2),
                "inflation_final": round(last_inflation, 2),
                "output_gap_initial": round(first_output_gap, 2),
                "output_gap_final": round(last_output_gap, 2),
                "quarters": len(sorted_rows),
            }

    return report

# ==============================================================================
# TEMPLATE SHEETS VALIDATION
# ==============================================================================

def validate_template_sheets(metadata: Dict, sheets: List[Dict]) -> Dict:
    """
    Perform comprehensive validation on regime template sheets.

    Returns: Dictionary with validation results
    """

    report = {
        "total_sheets": len(sheets),
        "expected_sheets": 16,
        "regimes": set(),
        "tiers": defaultdict(int),
        "field_stats": {
            "mechanism": {"min_chars": None, "max_chars": None, "avg_chars": None},
            "feedback_loop": {"min_chars": None, "max_chars": None, "avg_chars": None},
            "policy_feasibility": {"min_chars": None, "max_chars": None, "avg_chars": None},
            "incidence": {"min_chars": None, "max_chars": None, "avg_chars": None},
            "discriminating_evidence": {"min_chars": None, "max_chars": None, "avg_chars": None},
            "narrative_summary": {"min_chars": None, "max_chars": None, "avg_chars": None},
            "anti_overclaim": {"min_chars": None, "max_chars": None, "avg_chars": None},
        },
        "char_limits": {
            "mechanism": 500,
            "feedback_loop": 250,
            "policy_feasibility": 200,
            "incidence": 150,
            "discriminating_evidence": 370,
            "narrative_summary": 400,
            "anti_overclaim": 450,
        },
        "issues": [],
        "regime_properties": {},
    }

    # Analyze fields
    field_char_counts = {field: [] for field in report["field_stats"].keys()}

    for sheet in sheets:
        regime_code = sheet.get("regime_code")
        tier = sheet.get("tier")

        if regime_code:
            report["regimes"].add(regime_code)

        if tier:
            report["tiers"][tier] += 1

        # Track character counts
        for field in field_char_counts.keys():
            content = sheet.get(field, "")
            char_count = len(content)
            field_char_counts[field].append(char_count)

            # Check against limits
            if char_count > report["char_limits"][field]:
                report["issues"].append(
                    f"Regime {regime_code}: {field} exceeds limit "
                    f"({char_count}/{report['char_limits'][field]} chars)"
                )

        # Store regime properties
        if regime_code:
            report["regime_properties"][regime_code] = {
                "tier": tier,
                "exchange_rate": sheet.get("exchange_rate", "unknown"),
                "coordination": sheet.get("coordination", "unknown"),
                "credibility": sheet.get("credibility", "unknown"),
                "fiscal": sheet.get("fiscal", "unknown"),
                "episode_ref": sheet.get("episode_ref", ""),
            }

    # Compute field statistics
    for field, char_counts in field_char_counts.items():
        if char_counts:
            report["field_stats"][field]["min_chars"] = min(char_counts)
            report["field_stats"][field]["max_chars"] = max(char_counts)
            report["field_stats"][field]["avg_chars"] = round(statistics.mean(char_counts), 1)

    # Check completeness
    if len(sheets) != report["expected_sheets"]:
        report["issues"].append(f"Expected 16 sheets, found {len(sheets)}")

    if len(report["regimes"]) != 16:
        report["issues"].append(f"Expected 16 regimes, found {len(report['regimes'])}")

    # Check tier distribution
    if len(report["tiers"]) == 0:
        report["issues"].append("No tier information found")

    return report

# ==============================================================================
# CROSS-VALIDATION
# ==============================================================================

def cross_validate_data(traj_regimes: set, template_regimes: set) -> Dict:
    """
    Cross-validate that trajectory data and templates reference same regimes.
    """

    report = {
        "matching_regimes": traj_regimes.intersection(template_regimes),
        "regimes_in_trajectory_only": traj_regimes - template_regimes,
        "regimes_in_templates_only": template_regimes - traj_regimes,
        "status": "OK" if traj_regimes == template_regimes else "MISMATCH",
    }

    return report

# ==============================================================================
# BACKEND SCHEMA GENERATION
# ==============================================================================

def generate_backend_schemas(traj_report: Dict, template_report: Dict) -> Dict:
    """
    Generate suggested backend schemas for Phase 2 (SQL, API, indexes).
    """

    schemas = {
        "sql_schema": {
            "trajectories_table": {
                "columns": [
                    "regime_code VARCHAR(10) PRIMARY KEY",
                    "quarter INT (1-12)",
                    "inflation DECIMAL(5,2)",
                    "unemployment DECIMAL(5,2)",
                    "real_wage DECIMAL(7,2)",
                    "policy_rate DECIMAL(5,2)",
                    "real_ER DECIMAL(7,2)",
                    "current_account DECIMAL(5,2)",
                    "output_gap DECIMAL(5,2)",
                ],
                "indexes": [
                    "PRIMARY KEY (regime_code, quarter)",
                    "INDEX idx_regime (regime_code)",
                    "INDEX idx_quarter (quarter)",
                ]
            },
            "regimes_table": {
                "columns": [
                    "regime_code VARCHAR(10) PRIMARY KEY",
                    "regime_name VARCHAR(255)",
                    "tier INT (1-4)",
                    "exchange_rate VARCHAR(50)",
                    "coordination VARCHAR(50)",
                    "credibility VARCHAR(50)",
                    "fiscal VARCHAR(50)",
                    "episode_ref TEXT",
                    "mechanism TEXT",
                    "feedback_loop TEXT",
                    "policy_feasibility TEXT",
                    "incidence TEXT",
                    "discriminating_evidence TEXT",
                    "narrative_summary TEXT",
                    "anti_overclaim TEXT",
                ],
                "indexes": [
                    "PRIMARY KEY (regime_code)",
                    "INDEX idx_tier (tier)",
                    "INDEX idx_exchange (exchange_rate)",
                    "INDEX idx_coordination (coordination)",
                    "INDEX idx_credibility (credibility)",
                ]
            }
        },
        "api_response_format": {
            "regime_detail": {
                "regime_code": "FCHR",
                "regime_name": "Floating, Coordinated, High-Credibility, Rules-based",
                "tier": 1,
                "properties": {
                    "exchange_rate": "Floating",
                    "coordination": "Coordinated",
                    "credibility": "High",
                    "fiscal": "Rules-based"
                },
                "narrative": {
                    "mechanism": "...",
                    "feedback_loop": "...",
                    "policy_feasibility": "...",
                    "incidence": "...",
                    "discriminating_evidence": "...",
                    "narrative_summary": "...",
                    "anti_overclaim": "..."
                },
                "trajectory": [
                    {"quarter": 1, "inflation": 4.2, "unemployment": 2.0,
                     "real_wage": 98.5, "policy_rate": 2.0, "real_ER": 95.0,
                     "current_account": -0.5, "output_gap": -2.0},
                    {"quarter": 2, "inflation": 4.01, "unemployment": 2.47,
                     "real_wage": 98.72, "policy_rate": 1.82, "real_ER": 95.95,
                     "current_account": -0.38, "output_gap": -1.73},
                ]
            }
        },
        "search_indexes": {
            "by_tier": {
                "1": ["FCHR"],
                "2": ["FCHD", "FUHR", "FUHD"],
                "3": ["FCLU", "FCLD", "FULU", "FULD", "PFCHR", "PFCHD", "PFUHR", "PFUHD"],
                "4": ["PFCLU", "PFCLD", "PFULU", "PFULD"]
            },
            "by_exchange_rate": {
                "Floating": ["FCHR", "FCHD", "FCLU", "FCLD", "FUHR", "FUHD", "FULU", "FULD"],
                "Pegged": ["PFCHR", "PFCHD", "PFCLU", "PFCLD", "PFUHR", "PFUHD", "PFULU", "PFULD"]
            },
            "by_credibility": {
                "High": ["FCHR", "FCHD", "FUHR", "FUHD", "PFCHR", "PFCHD", "PFUHR", "PFUHD"],
                "Low": ["FCLU", "FCLD", "FULU", "FULD", "PFCLU", "PFCLD", "PFULU", "PFULD"]
            },
            "by_coordination": {
                "Coordinated": ["FCHR", "FCHD", "FCLU", "FCLD", "PFCHR", "PFCHD", "PFCLU", "PFCLD"],
                "Uncoordinated": ["FUHR", "FUHD", "FULU", "FULD", "PFUHR", "PFUHD", "PFULU", "PFULD"]
            }
        }
    }

    return schemas

# ==============================================================================
# MAIN EXECUTION
# ==============================================================================

if __name__ == "__main__":
    print("=" * 80)
    print("MacroLab Phase 2: Backend Data Preparation & Validation")
    print("=" * 80)
    print()

    # Load data
    print("Loading data...")
    traj_metadata, traj_data = load_trajectory_data("TRAJECTORY_DATA.json")
    template_metadata, template_sheets = load_template_sheets("REGIME_TEMPLATE_SHEETS.json")
    print(f"✅ Loaded {len(traj_data)} trajectory rows and {len(template_sheets)} regime sheets")
    print()

    # Validate trajectory data
    print("=" * 80)
    print("TRAJECTORY DATA VALIDATION")
    print("=" * 80)
    traj_report = validate_trajectory_data(traj_metadata, traj_data)

    print(f"Total rows: {traj_report['total_rows']} (expected {traj_report['expected_rows']})")
    print(f"Regimes: {len(traj_report['regimes'])} (expected 16)")
    print(f"Quarters: {len(traj_report['quarters'])} (expected 12)")
    print()

    print("Variable Statistics:")
    for var, stats in traj_report["variables"].items():
        print(f"  {var:20s}: min={stats['min']:8}, max={stats['max']:8}, "
              f"mean={stats['mean']:8}, std={stats['std']:6}, nulls={stats['nulls']}")
    print()

    if traj_report["issues"]:
        print("⚠️  Issues found:")
        for issue in traj_report["issues"]:
            print(f"  - {issue}")
    else:
        print("✅ No data quality issues found")

    print()
    print("Regime Convergence (sample):")
    for regime in sorted(traj_report["regime_convergence"].keys())[:5]:
        conv = traj_report["regime_convergence"][regime]
        print(f"  {regime:8s}: inflation {conv['inflation_initial']:6.2f} → {conv['inflation_final']:6.2f}, "
              f"output_gap {conv['output_gap_initial']:6.2f} → {conv['output_gap_final']:6.2f}")
    print()

    # Validate template sheets
    print("=" * 80)
    print("REGIME TEMPLATE SHEETS VALIDATION")
    print("=" * 80)
    template_report = validate_template_sheets(template_metadata, template_sheets)

    print(f"Total sheets: {template_report['total_sheets']} (expected {template_report['expected_sheets']})")
    print(f"Regimes: {len(template_report['regimes'])} (expected 16)")
    print(f"Tier distribution: {dict(template_report['tiers'])}")
    print()

    print("Field Character Limits:")
    for field, limit in template_report["char_limits"].items():
        stats = template_report["field_stats"][field]
        print(f"  {field:25s}: limit={limit:3d}, min={stats['min_chars']:3d}, "
              f"max={stats['max_chars']:3d}, avg={stats['avg_chars']:6.1f}")
    print()

    if template_report["issues"]:
        print("⚠️  Issues found:")
        for issue in template_report["issues"]:
            print(f"  - {issue}")
    else:
        print("✅ All character limits respected")

    print()

    # Cross-validation
    print("=" * 80)
    print("CROSS-VALIDATION")
    print("=" * 80)
    cross_report = cross_validate_data(traj_report["regimes"], template_report["regimes"])

    print(f"Status: {cross_report['status']}")
    print(f"Matching regimes: {len(cross_report['matching_regimes'])}")

    if cross_report["regimes_in_trajectory_only"]:
        print(f"⚠️  In trajectory only: {cross_report['regimes_in_trajectory_only']}")

    if cross_report["regimes_in_templates_only"]:
        print(f"⚠️  In templates only: {cross_report['regimes_in_templates_only']}")

    print()

    # Backend schemas
    print("=" * 80)
    print("BACKEND SCHEMA RECOMMENDATIONS")
    print("=" * 80)
    schemas = generate_backend_schemas(traj_report, template_report)

    print("SQL Schema (Trajectories table):")
    for col in schemas["sql_schema"]["trajectories_table"]["columns"][:5]:
        print(f"  {col}")
    print(f"  ... (+{len(schemas['sql_schema']['trajectories_table']['columns']) - 5} more columns)")
    print()

    print("SQL Indexes (Regimes table):")
    for idx in schemas["sql_schema"]["regimes_table"]["indexes"]:
        print(f"  {idx}")
    print()

    print("API Response Format: regime_detail endpoint")
    print("  - Includes regime metadata, narrative fields, and trajectory data")
    print("  - Ready for frontend prediction/comparison workflow")
    print()

    print("Search/Filter Indexes:")
    for filter_name in schemas["search_indexes"].keys():
        count = sum(len(v) for v in schemas["search_indexes"][filter_name].values())
        print(f"  {filter_name}: {count} regimes indexed")
    print()

    # Summary
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"✅ Data validation: {'PASSED' if not traj_report['issues'] else 'FAILED'}")
    print(f"✅ Template validation: {'PASSED' if not template_report['issues'] else 'FAILED'}")
    print(f"✅ Cross-validation: {cross_report['status']}")
    print()
    print("Phase 2 Backend Ready:")
    print(f"  - {len(traj_report['regimes'])} regimes × 12 quarters = {len(traj_data)} trajectory records")
    print(f"  - {len(template_report['regimes'])} regime templates with 8 fields each")
    print(f"  - All data labeled: {traj_metadata['label'][:50]}...")
    print()
    print("Next: Hand off JSON files + SQL schema to Phase 2 backend team")
    print("=" * 80)
