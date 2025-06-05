import json
from datetime import datetime, timedelta, timezone

# --- Configuration ---
JSON_FILE_PATH = "workspaces.json"

# Define the specific time periods
# Period 1: Jan 2025 - June 2025
P1_START = datetime(2025, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
P1_END = datetime(2025, 6, 30, 23, 59, 59, 999999, tzinfo=timezone.utc)

# Period 2: July 2024 - Dec 2024 (the 6 months before P1)
P2_START = datetime(2024, 7, 1, 0, 0, 0, tzinfo=timezone.utc)
P2_END = datetime(2024, 12, 31, 23, 59, 59, 999999, tzinfo=timezone.utc)
# --- End Configuration ---

def parse_iso_datetime(date_str):
    """
    Parses an ISO 8601 datetime string, handling the 'Z' for UTC.
    Returns a timezone-aware datetime object or None if parsing fails.
    """
    if not date_str:
        return None
    if date_str.endswith('Z'):
        date_str = date_str[:-1] + '+00:00'
    try:
        return datetime.fromisoformat(date_str)
    except ValueError:
        try:
            # Fallback for slightly different ISO formats if needed
            return datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S.%f+00:00')
        except ValueError:
            try:
                return datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S+00:00')
            except ValueError:
                print(f"Warning: Could not parse date string: {date_str}")
                return None

def get_comparison_text(current_val, previous_val, item_name="workspaces"):
    """Generates text comparing current and previous values."""
    if previous_val == 0:
        if current_val > 0:
            return f"Increased from 0 to {current_val} (previously no {item_name})."
        else:
            return f"Remained at 0 {item_name}."
    
    if current_val > previous_val:
        diff = current_val - previous_val
        percentage_increase = (diff / previous_val) * 100
        return f"Increased by {diff} ({percentage_increase:.2f}%) from {previous_val}."
    elif current_val < previous_val:
        diff = previous_val - current_val
        percentage_decrease = (diff / previous_val) * 100
        return f"Decreased by {diff} ({percentage_decrease:.2f}%) from {previous_val}."
    else:
        return f"Remained the same at {current_val}."

def analyze_workspace_data(file_path):
    """
    Analyzes workspace data from a JSON file to extract specified metrics.
    """
    all_workspace_ids = set()
    
    created_p1_count = 0 # Jan-June 2025
    created_p2_count = 0 # July-Dec 2024
    
    # Counts workspaces CREATED in the period that are CURRENTLY archived
    archived_created_p1_count = 0 
    archived_created_p2_count = 0

    instance_counts = {} # For "other important notes"
    role_counts = {"read": {}, "write": {}} # For "other important notes"
    missing_created_at_count = 0
    parse_errors_count = 0

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                data_objects = json.load(f)
                if not isinstance(data_objects, list):
                    data_objects = [data_objects]
            except json.JSONDecodeError:
                f.seek(0)
                data_objects = []
                for line_number, line in enumerate(f, 1):
                    line = line.strip()
                    if line:
                        try:
                            data_objects.append(json.loads(line))
                        except json.JSONDecodeError as e_line:
                            print(f"Warning: Skipping invalid JSON on line {line_number}: {e_line}")
                            parse_errors_count += 1
        
        if not data_objects and parse_errors_count == 0:
            print("No data objects found or successfully parsed from the file.")
            return

        for ws in data_objects:
            workspace_id = ws.get("workspaceId")
            if workspace_id is not None:
                all_workspace_ids.add(str(workspace_id))

            instance = ws.get("instance", "Unknown")
            instance_counts[instance] = instance_counts.get(instance, 0) + 1

            read_role = ws.get("readRole", "Unknown")
            write_role = ws.get("writeRole", "Unknown")
            role_counts["read"][read_role] = role_counts["read"].get(read_role, 0) + 1
            role_counts["write"][write_role] = role_counts["write"].get(write_role, 0) + 1

            created_at_str = ws.get("createdAt", {}).get("$date")
            if not created_at_str:
                missing_created_at_count +=1
                # Decide if you want to skip this record for date-based metrics or log more verbosely
                # print(f"Warning: Missing 'createdAt.$date' for workspaceId: {workspace_id}")
                continue # Skip to next workspace if no creation date

            created_at_date = parse_iso_datetime(created_at_str)
            if not created_at_date:
                parse_errors_count +=1
                continue # Skip if date parsing failed

            is_archived = ws.get("archived") is True

            # Check for newly created in P1 (Jan-June 2025)
            if P1_START <= created_at_date <= P1_END:
                created_p1_count += 1
                if is_archived:
                    archived_created_p1_count += 1
            
            # Check for newly created in P2 (July-Dec 2024)
            elif P2_START <= created_at_date <= P2_END:
                created_p2_count += 1
                if is_archived:
                    archived_created_p2_count += 1
        
        total_unique_workspaces = len(all_workspace_ids)

        print("\n--- Workspace Metrics ---")
        print(f"1. Total Unique Workspaces: {total_unique_workspaces}")
        
        print(f"\n2. Newly Created Workspaces:")
        print(f"   - Jan 2025 - June 2025: {created_p1_count}")
        print(f"   - July 2024 - Dec 2024: {created_p2_count}")
        comparison_created = get_comparison_text(created_p1_count, created_p2_count, "newly created workspaces")
        print(f"   - Comparison (Jan-June 2025 vs July-Dec 2024): {comparison_created}")

        print(f"\n3. Archived Workspaces (i.e., created in period AND currently archived):")
        print(f"   - Jan 2025 - June 2025: {archived_created_p1_count}")
        print(f"   - July 2024 - Dec 2024: {archived_created_p2_count}")
        comparison_archived = get_comparison_text(archived_created_p1_count, archived_created_p2_count, "archived workspaces created in period")
        print(f"   - Comparison (Jan-June 2025 vs July-Dec 2024): {comparison_archived}")
        print(f"   Note: This counts workspaces *created* in the period that are *currently* archived, not necessarily archived *during* that period.")

        print("\n--- Other Important Notes from the Data ---")
        print(f"- Processed {len(data_objects)} raw entries from the file.")
        if missing_created_at_count > 0:
            print(f"- Entries skipped due to missing 'createdAt.$date': {missing_created_at_count}")
        if parse_errors_count > 0:
            print(f"- Entries skipped due to JSON or date parsing errors (beyond initial file load): {parse_errors_count}")
        
        print("\n- Distribution of Workspaces by 'instance':")
        if instance_counts:
            for inst, count in sorted(instance_counts.items(), key=lambda item: item[1], reverse=True):
                print(f"  - {inst}: {count}")
        else:
            print("  - No instance data found or all were 'Unknown'.")

        print("\n- Distribution of 'readRole':")
        if role_counts["read"]:
            for role, count in sorted(role_counts["read"].items(), key=lambda item: item[1], reverse=True):
                print(f"  - {role}: {count}")
        else:
            print("  - No readRole data found.")

        print("\n- Distribution of 'writeRole':")
        if role_counts["write"]:
            for role, count in sorted(role_counts["write"].items(), key=lambda item: item[1], reverse=True):
                print(f"  - {role}: {count}")
        else:
            print("  - No writeRole data found.")
            
        print("\n- Key Data Limitations:")
        print("  - No 'updatedAt' field: Cannot determine workspace activity or when updates occurred.")
        print("  - No 'archivedAt' field: Cannot determine *when* a workspace was archived, only its current archived status and creation date.")
        print("  - Several requested metrics (line count, views, size, visualization type, node types, API/CLI usage) are not available in this dataset.")


    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    print(f"Analyzing workspace data from: {JSON_FILE_PATH}")
    print(f"Comparing periods: Jan-June 2025 (P1) vs July-Dec 2024 (P2)")
    analyze_workspace_data(JSON_FILE_PATH)