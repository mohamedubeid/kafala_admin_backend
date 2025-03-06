import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ChildSponsorShipNotesDTO } from '../src/service/dto/child-sponsor-ship-notes.dto';
import { ChildSponsorShipNotesService } from '../src/service/child-sponsor-ship-notes.service';

describe('ChildSponsorShipNotes Controller', () => {
  let app: INestApplication;

  const authGuardMock = { canActivate: (): any => true };
  const rolesGuardMock = { canActivate: (): any => true };
  const entityMock: any = {
    id: 'entityId',
  };

  const serviceMock = {
    findById: (): any => entityMock,
    findAndCount: (): any => [entityMock, 0],
    save: (): any => entityMock,
    update: (): any => entityMock,
    deleteById: (): any => entityMock,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuardMock)
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideProvider(ChildSponsorShipNotesService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all child-sponsor-ship-notes ', async () => {
    const getEntities: ChildSponsorShipNotesDTO[] = (await request(app.getHttpServer()).get('/api/child-sponsor-ship-notes').expect(200))
      .body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET child-sponsor-ship-notes by id', async () => {
    const getEntity: ChildSponsorShipNotesDTO = (
      await request(app.getHttpServer())
        .get('/api/child-sponsor-ship-notes/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create child-sponsor-ship-notes', async () => {
    const createdEntity: ChildSponsorShipNotesDTO = (
      await request(app.getHttpServer()).post('/api/child-sponsor-ship-notes').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update child-sponsor-ship-notes', async () => {
    const updatedEntity: ChildSponsorShipNotesDTO = (
      await request(app.getHttpServer()).put('/api/child-sponsor-ship-notes').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update child-sponsor-ship-notes from id', async () => {
    const updatedEntity: ChildSponsorShipNotesDTO = (
      await request(app.getHttpServer())
        .put('/api/child-sponsor-ship-notes/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE child-sponsor-ship-notes', async () => {
    const deletedEntity: ChildSponsorShipNotesDTO = (
      await request(app.getHttpServer())
        .delete('/api/child-sponsor-ship-notes/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
