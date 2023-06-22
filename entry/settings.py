from airone.lib.settings import Settings

CONFIG = Settings(
    {
        "MAX_LIST_ENTRIES": 100,
        "MAX_LIST_REFERRALS": 50,
        "MAX_SEARCH_ENTRIES": 20,
        "TEMPLATE_CONFIG": {
            "MAX_LABEL_STRING": 45,
            "SORT_ORDER": {
                "name": "name",
                "name_reverse": "name_reverse",
                "updated_time": "updated_time",
                "updated_time_reverse": "updated_time_reverse",
                "created_time": "created_time",
                "created_time_reverse": "created_time_reverse",
            },
        },
        "DEFAULT_LIST_SORT_ORDER": "name",
        "MAX_HISTORY_COUNT": 10,
        "MAX_QUERY_SIZE": 249,  # '.*' + '[aA]'*249 + '.*' = 1000
        "MAX_QUERY_COUNT": 1000,
        "SEARCH_CHAIN_ACCEPTABLE_RESULT_COUNT": 1000,
        "EMPTY_SEARCH_CHARACTER": "\\",
        "EMPTY_SEARCH_CHARACTER_CODE": chr(165),
        "EXSIT_CHARACTER": "*",
        "AND_SEARCH_CHARACTER": "&",
        "OR_SEARCH_CHARACTER": "|",
        "ESCAPE_CHARACTERS": [
            "(",
            ")",
            "<",
            '"',
            "{",
            "[",
            "#",
            "~",
            "@",
            "+",
            "*",
            ".",
            "?",
        ],
        "ESCAPE_CHARACTERS_REFERRALS_ENTRY": [
            "$",
            "(",
            "^",
            "|",
            "[",
            "+",
            "*",
            ".",
            "?",
            "\\",
        ],
        "ESCAPE_CHARACTERS_ENTRY_LIST": [
            "$",
            "(",
            "^",
            "\\",
            "|",
            "[",
            "+",
            "*",
            ".",
            "?",
        ],
        "TIME_FORMAT": "%Y-%m-%dT%H:%M:%S",
        "SEARCH_RESULTS_FILTER_KEY": Settings(
            {
                "CLEARED": 0,
                "EMPTY": 1,
                "NON_EMPTY": 2,
                "TEXT_CONTAINED": 3,
                "DUPLICATED": 4,
            }
        ),
    }
)
