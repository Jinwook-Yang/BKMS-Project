import psycopg2


### CHANGE THIS TO YOUR DATABASE
database = 
user = 
password = 
host = 
port = 
data_path = "./"

def create_table(database, user, password, host, port):
    conn = psycopg2.connect(
        database=database, user=user, password=password, host=host, port=port
    )

    cursor = conn.cursor()
    print("create table")
    print()
    cursor.execute(
        '''
        CREATE TABLE if not exists movies (
            id INT PRIMARY KEY,
            title VARCHAR,
            year INT
        );
        '''
    )
    cursor.execute(
        '''
        CREATE TABLE if not exists genres (
            id INT PRIMARY KEY,
            genreName VARCHAR
        );
        '''
    )
    cursor.execute(
        '''
        CREATE TABLE if not exists users (
            id INT PRIMARY KEY,
            userEmail VARCHAR,
            password VARCHAR,
            userName VARCHAR
        );
        '''
    )
    cursor.execute(
        '''
        CREATE TABLE if not exists movie_genre (
            id INT PRIMARY KEY,
            movieId INT,
            genreId INT,
            FOREIGN KEY (movieId) REFERENCES movies(id),
            FOREIGN KEY (genreId) REFERENCES genres(id),
            UNIQUE (movieId, genreId)
        );
        '''
    )
    cursor.execute(
        '''
        CREATE TABLE if not exists ratings (
            id INT PRIMARY KEY,
            userId INT,
            movieId INT,
            rating FLOAT,
            timestamp TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id),
            FOREIGN KEY (movieId) REFERENCES movies(id)
        );
        '''
    )
    cursor.execute(
        '''
        CREATE TABLE if not exists tags (
            id INT PRIMARY KEY,
            userId INT,
            movieId INT,
            tag VARCHAR,
            timestamp TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id),
            FOREIGN KEY (movieId) REFERENCES movies(id)
        );
        '''
    )
    conn.commit()
    conn.close()


def insert_data(database, user, password, host, port, data_path):
    conn = psycopg2.connect(
        database=database, user=user, password=password, host=host, port=port
    )

    cursor = conn.cursor()

    print("insert movie")
    with open(data_path + "/movies.csv", 'r', encoding = 'UTF-8') as f:
        next(f)
        cursor.copy_from(f, 'movies', sep='|') 
    conn.commit()

    print("insert genres")

    with open(data_path + "/genres.csv", 'r', encoding = 'UTF-8') as f:
        next(f)
        cursor.copy_from(f, 'genres', sep='|')
    conn.commit()

    print("insert movie_genre")
    with open(data_path + "/movie_genre.csv", 'r', encoding = 'UTF-8') as f:
        next(f)
        cursor.copy_from(f, 'movie_genre', sep='|')
    conn.commit()


    print("insert users")
    with open(data_path + "/users.csv", 'r', encoding = 'UTF-8') as f:
        next(f)
        cursor.copy_from(f, 'users',  sep='|')
    conn.commit()

    print("insert ratings")
    with open(data_path + "/ratings.csv", 'r', encoding = 'UTF-8') as f:
        next(f)
        cursor.copy_from(f, 'ratings', sep='|')
    conn.commit()

    print("insert tags")
    with open(data_path + "/tags.csv", 'r', encoding = 'UTF-8') as f:
        next(f)
        cursor.copy_from(f, 'tags',  sep='|')
    conn.commit()

    conn.close()


def create_view(database, user, password, host, port):
    conn = psycopg2.connect(
        database=database, user=user, password=password, host=host, port=port
    )

    cursor = conn.cursor()

    print("make view")
    cursor.execute(
        """CREATE VIEW view_movie_ratings AS (
        SELECT m.id, m.title, ROUND(AVG(r.rating)::numeric, 1) AS avg_rating
        FROM movies m
        JOIN ratings r ON m.id = r.movieid 
        GROUP BY m.id, m.title
        );""")

    conn.commit()
    conn.close()

def create_trigger(database, user, password, host, port):
    conn = psycopg2.connect(
        database=database, user=user, password=password, host=host, port=port
    )
    cursor = conn.cursor()

    create_function_sql = """
    CREATE OR REPLACE FUNCTION delete_user_related_data() 
    RETURNS TRIGGER AS $$
    BEGIN
    -- ratings 테이블에서 사용자 관련 데이터 삭제
    DELETE FROM ratings WHERE userid = OLD.id;

    -- tags 테이블에서 사용자 관련 데이터 삭제
    DELETE FROM tags WHERE userid = OLD.id;

    RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;
    """

    # 트리거 생성 SQL
    create_trigger_sql = """
    CREATE TRIGGER user_delete_trigger
    BEFORE DELETE ON users
    FOR EACH ROW
    EXECUTE FUNCTION delete_user_related_data();
    """

    try:
        # 함수 생성 실행
        cursor.execute(create_function_sql)
        print("Function created successfully.")

        # 트리거 생성 실행
        cursor.execute(create_trigger_sql)
        print("Trigger created successfully.")

        # 변경 사항 커밋
        conn.commit()
    except Exception as e:
        print(f"An error occurred: {e}")
        # 오류 발생 시 롤백
        conn.rollback()
    finally:
        # 커서와 연결 닫기
        cursor.close()
        conn.close()


create_table(database, user, password, host, port)
insert_data(database, user, password, host, port, data_path)
create_view(database, user, password, host, port)
create_trigger(database, user, password, host, port)

