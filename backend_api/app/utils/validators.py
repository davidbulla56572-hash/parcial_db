GROUP_VALUES = tuple("ABCDEFGH")


def normalize_group(group: str) -> str:
    return group.strip().upper()


def ensure_group_value(group: str) -> str:
    normalized = normalize_group(group)
    if normalized not in GROUP_VALUES:
        raise ValueError("El grupo debe ser una letra entre A y H.")
    return normalized
