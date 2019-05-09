import csv
from election_stats.model import Party, RegionType, Region, Result, get_engine
from sqlalchemy.orm import sessionmaker

filename = 'data/btw17_kerg.csv'
engine = get_engine()
Session = sessionmaker(bind=engine)

session = Session()

with open(filename, newline='\n', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile, delimiter=';', quotechar='"')
    # read label rows
    partyRow = next(reader)
    voteTypeRow = next(reader)
    periodRow = next(reader)

    parties = []
    regions = []
    results = []

    # create parties
    startColumn = 19 # column where the result/party data starts

    for i in range(startColumn, len(partyRow), 4):
        if not partyRow[i]:
            continue
        party = Party(
            name = partyRow[i],
            id = int((i - startColumn)/4),
        )
        parties.append(party)
        print(party)

    # read data rows
    for row in reader:
        if not row[0]:
            continue
        
        # we mostly use the original ids, but add an offset of 1000 for states and the total to avoid id collisions
        region = Region(
            id = int(row[0]) + 1000 if not (row[2] and int(row[2]) != 99) else int(row[0]),
            name = row[1],
            parent_region_id = int(row[2]) + 1000 if row[2] else row[2],
            eligibleVoters = int(row[3]),
            voters = int(row[7]),
            regionType = RegionType.country if int(row[0]) == 99 else (RegionType.state if int(row[2]) == 99 else RegionType.district)
        )
        regions.append(region)
        # print(region)

        for i in range(startColumn, len(partyRow), 4):
            if not partyRow[i]:
                continue
            
            result = Result(
                party_id = int((i - startColumn)/4),
                region_id = region.id,
                erststimmen = int(row[i]) if row[i] else row[i],
                zweitstimmen = int(row[i+2]) if row[i+2] else row[i+2],
            )
            results.append(result)
            # print(result)
    
    session.add_all(parties)
    session.add_all(regions)
    session.add_all(results)
    session.commit()
    
     