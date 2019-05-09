### setup instruction ###

requires python 3.7+

To parse the csv file first delete the `database.db` file. Then run `python parse_csv.py`. The database should be created and filled with values.

To run the app run it as a package like this: `python -m election_stats`

### REST API documentation ###

    GET /regions/
    -> get list of all region objects (JSON)

    GET /regions/<regionID>/
    -> get specific region object (JSON)

    GET /regions/<regionID>/subregions/
    -> get list of contained subregions (JSON)

    GET /regions/<regionID>/results/
    -> get list of result objects (JSON)

    GET /parties/
    -> get list of all party objects (JSON)

    region object format:
    {
        "id": ...,
        "name": ...,
        "parent_region_id": ...,
        "eligibleVoters": ...,
        "voters": ...,
        "regionType": ...
    }

    party object format:
    {
        "name": ...,
        "id": ...
    }

    result object format:
    {
        "region_id": ...,
        "party_id": ...,
        "erststimmen": ...,
        "zweitstimmen": ...
    }
