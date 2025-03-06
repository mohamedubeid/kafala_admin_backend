import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ChildNotesDTO } from '../src/service/dto/child-notes.dto';
import { ChildNotesService } from '../src/service/child-notes.service';

describe('ChildNotes Controller', () => {
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
      .overrideProvider(ChildNotesService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all child-notes ', async () => {
    const getEntities: ChildNotesDTO[] = (await request(app.getHttpServer()).get('/api/child-notes').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET child-notes by id', async () => {
    const getEntity: ChildNotesDTO = (
      await request(app.getHttpServer())
        .get('/api/child-notes/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create child-notes', async () => {
    const createdEntity: ChildNotesDTO = (await request(app.getHttpServer()).post('/api/child-notes').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update child-notes', async () => {
    const updatedEntity: ChildNotesDTO = (await request(app.getHttpServer()).put('/api/child-notes').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update child-notes from id', async () => {
    const updatedEntity: ChildNotesDTO = (
      await request(app.getHttpServer())
        .put('/api/child-notes/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE child-notes', async () => {
    const deletedEntity: ChildNotesDTO = (
      await request(app.getHttpServer())
        .delete('/api/child-notes/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
