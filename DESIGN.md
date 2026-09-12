# AstraX Design System — Dark Ops Room

## 1. Visual Philosophy
AstraX is a tactical criminal-network-analysis platform built for state-police cyber-crime cells and investigators. The interface resembles an air-gapped operations room rather than a generic SaaS tool.

### Key Tenets
1. **Dark Ops Room First**: Dark mode only. Base surfaces are near-black slate (`#0B0F14`, `#10151C`, `#161C25`).
2. **Restrained Dual Accent**:
   - **Desaturated Gold/Amber (`#C9A227`)**: Official authority, insignia seals, primary CTAs, active operational nav.
   - **Technical Blue (`#3B82F6`)**: Informational indicators, network links, data channels, graphs.
   - *Rule*: Never let both accents compete on the same element.
3. **Fixed Semantic Colors (Never Repurposed)**:
   - `Confirmed / Evidentiary`: `#10B981` (Green)
   - `High Risk / Incident`: `#EF4444` (Red)
   - `Pattern Alert / Pending`: `#F59E0B` (Amber)
   - `GNN Hypothesis / Predicted`: `#8B5CF6` (Violet / dashed)
   - `Neutral / Unknown`: `#64748B` (Slate)
4. **Systematic Monospace**:
   - Every Case ID, FIR number, hash, wallet address, phone number, GPS coordinate, BNS statutory citation, and confidence value must use `font-mono`.
5. **Tactical Textures (≤8% Opacity)**:
   - Subtle dot-matrix, coordinate grid overlay, and radar sweeps applied as background motifs without interfering with text legibility.
6. **Progressive Disclosure**:
   - Routine overviews default to clean fact summaries; GNN hypothesis edges, confidence breakdowns, and raw log traces are opt-in.
7. **Explicit Confidence & Citations**:
   - Every AI insight includes a plain-language qualifier ("strong evidence" / "possible lead" / "unconfirmed hypothesis") and a clickable "view source" citation affordance.
8. **Investigative Hypothesis Label**:
   - All GNN-generated crime reconstruction theories carry permanent, non-dismissible labeling: `"Investigative hypothesis — not a finding"`.
