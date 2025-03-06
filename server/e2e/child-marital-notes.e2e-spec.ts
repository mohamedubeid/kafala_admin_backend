import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ChildMaritalNotesDTO } from '../src/service/dto/child-marital-notes.dto';
import { ChildMaritalNotesService } from '../src/service/child-marital-notes.service';

describe('ChildMaritalNotes Controller', () => {
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
      .overrideProvider(ChildMaritalNotesService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all child-marital-notes ', async () => {
    const getEntities: ChildMaritalNotesDTO[] = (await request(app.getHttpServer()).get('/api/child-marital-notes').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET child-marital-notes by id', async () => {
    const getEntity: ChildMaritalNotesDTO = (
      await request(app.getHttpServer())
        .get('/api/child-marital-notes/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create child-marital-notes', async () => {
    const createdEntity: ChildMaritalNotesDTO = (
      await request(app.getHttpServer()).post('/api/child-marital-notes').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update child-marital-notes', async () => {
    const updatedEntity: ChildMaritalNotesDTO = (
      await request(app.getHttpServer()).put('/api/child-marital-notes').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update child-marital-notes from id', async () => {
    const updatedEntity: ChildMaritalNotesDTO = (
      await request(app.getHttpServer())
        .put('/api/child-marital-notes/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE child-marital-notes', async () => {
    const deletedEntity: ChildMaritalNotesDTO = (
      await request(app.getHttpServer())
        .delete('/api/child-marital-notes/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
