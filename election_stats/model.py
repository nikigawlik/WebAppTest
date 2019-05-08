from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Enum, ForeignKey
import enum

Base = declarative_base()

class RegionType(enum.Enum):
    district = 0
    state = 1
    country = 2

class Region(Base):
    __tablename__ = 'regions'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    parentRegion = Column(Integer, ForeignKey('regions.id'))
    eligibleVoters = Column(Integer)
    voters = Column(Integer)
    regionType = Column(Enum(RegionType))

    def __str__(self):
        return 'Region ' + str(self.id) + ' - ' + str(self.name) + ' (belongs to ' + str(self.parentRegion) + ')'

class Party(Base):
    __tablename__ = 'parties'
    id = Column(Integer, primary_key=True)
    name = Column(String)

    def __str__(self):
        return 'Party ' + str(self.id) + ' - ' + str(self.name)

class Result(Base):
    __tablename__ = 'results'
    region = Column(Integer, ForeignKey('regions.id'), primary_key=True)
    party = Column(Integer, ForeignKey('parties.id'), primary_key=True)
    erststimmen = Column(Integer)
    zweitstimmen = Column(Integer)


engine = create_engine('sqlite:///database.db', echo=True)
Base.metadata.create_all(engine)

def get_engine():
    return engine