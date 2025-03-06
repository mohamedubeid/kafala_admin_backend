import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { NotesDTO } from '../src/service/dto/notes.dto';
import { NotesService } from '../src/service/notes.service';

describe('Notes Controller', () => {
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
      .overrideProvider(NotesService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all notes ', async () => {
    const getEntities: NotesDTO[] = (await request(app.getHttpServer()).get('/api/notes').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET notes by id', async () => {
    const getEntity: NotesDTO = (
      await request(app.getHttpServer())
        .get('/api/notes/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create notes', async () => {
    const createdEntity: NotesDTO = (await request(app.getHttpServer()).post('/api/notes').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update notes', async () => {
    const updatedEntity: NotesDTO = (await request(app.getHttpServer()).put('/api/notes').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update notes from id', async () => {
    const updatedEntity: NotesDTO = (
      await request(app.getHttpServer())
        .put('/api/notes/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE notes', async () => {
    const deletedEntity: NotesDTO = (
      await request(app.getHttpServer())
        .delete('/api/notes/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
