import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ChildEducationNotesDTO } from '../src/service/dto/child-education-notes.dto';
import { ChildEducationNotesService } from '../src/service/child-education-notes.service';

describe('ChildEducationNotes Controller', () => {
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
      .overrideProvider(ChildEducationNotesService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all child-education-notes ', async () => {
    const getEntities: ChildEducationNotesDTO[] = (await request(app.getHttpServer()).get('/api/child-education-notes').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET child-education-notes by id', async () => {
    const getEntity: ChildEducationNotesDTO = (
      await request(app.getHttpServer())
        .get('/api/child-education-notes/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create child-education-notes', async () => {
    const createdEntity: ChildEducationNotesDTO = (
      await request(app.getHttpServer()).post('/api/child-education-notes').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update child-education-notes', async () => {
    const updatedEntity: ChildEducationNotesDTO = (
      await request(app.getHttpServer()).put('/api/child-education-notes').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update child-education-notes from id', async () => {
    const updatedEntity: ChildEducationNotesDTO = (
      await request(app.getHttpServer())
        .put('/api/child-education-notes/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE child-education-notes', async () => {
    const deletedEntity: ChildEducationNotesDTO = (
      await request(app.getHttpServer())
        .delete('/api/child-education-notes/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
