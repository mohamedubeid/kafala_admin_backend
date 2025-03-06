import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ChildHealthNotesDTO } from '../src/service/dto/child-health-notes.dto';
import { ChildHealthNotesService } from '../src/service/child-health-notes.service';

describe('ChildHealthNotes Controller', () => {
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
      .overrideProvider(ChildHealthNotesService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all child-health-notes ', async () => {
    const getEntities: ChildHealthNotesDTO[] = (await request(app.getHttpServer()).get('/api/child-health-notes').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET child-health-notes by id', async () => {
    const getEntity: ChildHealthNotesDTO = (
      await request(app.getHttpServer())
        .get('/api/child-health-notes/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create child-health-notes', async () => {
    const createdEntity: ChildHealthNotesDTO = (
      await request(app.getHttpServer()).post('/api/child-health-notes').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update child-health-notes', async () => {
    const updatedEntity: ChildHealthNotesDTO = (
      await request(app.getHttpServer()).put('/api/child-health-notes').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update child-health-notes from id', async () => {
    const updatedEntity: ChildHealthNotesDTO = (
      await request(app.getHttpServer())
        .put('/api/child-health-notes/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE child-health-notes', async () => {
    const deletedEntity: ChildHealthNotesDTO = (
      await request(app.getHttpServer())
        .delete('/api/child-health-notes/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
