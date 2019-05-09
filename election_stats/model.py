from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship, backref
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
    parent_region_id = Column(Integer, ForeignKey('regions.id'))
    eligibleVoters = Column(Integer)
    voters = Column(Integer)
    regionType = Column(Enum(RegionType))

    childRegions = relationship("Region", backref=backref('parentRegion', remote_side=[id]))
    results = relationship("Result", back_populates="region")

    def __str__(self):
        return 'Region ' + str(self.id) + ' - ' + str(self.name) + ' (belongs to ' + str(self.parent_region_id) + ')'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'parent_region_id': self.parent_region_id,
            'eligibleVoters': self.eligibleVoters,
            'voters': self.voters,
            'regionType': str(self.regionType),
        }

class Party(Base):
    __tablename__ = 'parties'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    
    results = relationship("Result", back_populates="party")

    def __str__(self):
        return 'Party ' + str(self.id) + ' - ' + str(self.name)

    def to_dict(self):
        return {'name': self.name, 'id': self.id}

class Result(Base):
    __tablename__ = 'results'
    region_id = Column(Integer, ForeignKey('regions.id'), primary_key=True)
    party_id = Column(Integer, ForeignKey('parties.id'), primary_key=True)
    erststimmen = Column(Integer)
    zweitstimmen = Column(Integer)

    party = relationship("Party", back_populates="results")
    region = relationship("Region", back_populates="results")

    def to_dict(self):
        return {
            'region_id': self.region_id,
            'party_id': self.party_id,
            'erststimmen': self.erststimmen,
            'zweitstimmen': self.zweitstimmen,
        }


engine = create_engine('sqlite:///database.db', echo=True)
Base.metadata.create_all(engine)

def get_engine():
    return engine