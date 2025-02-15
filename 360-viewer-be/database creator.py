from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, ForeignKey, Float
engine = create_engine('sqlite:///360viewer.db', echo=True)
meta = MetaData()

pano = Table(
   'pano', meta, 
   Column('id', Integer, primary_key = True), 
   Column('preview', String), 
   Column('title', String), 
)

poi = Table(
   'poi', meta, 
   Column('id', Integer, primary_key = True), 
   Column('pano_id', Integer, ForeignKey('pano.id')), 
   Column('name', String), 
   Column('description', String),
   Column('type', String),
   Column('ath', Float),
   Column('atv', Float),
   Column('video', String),
   Column('pdf', String)
   )

meta.create_all(engine)